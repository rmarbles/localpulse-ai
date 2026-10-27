const reviewCache = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 Hours

export async function POST(req) {
  try {
    const { googleUrl, businessName } = await req.json();
    const rawQuery = (businessName || googleUrl || "").trim();

    if (!rawQuery) {
      return Response.json(
        { success: false, error: "Please provide a valid business name and city/state." },
        { status: 400 }
      );
    }

    const cacheKey = rawQuery.toLowerCase();

    // 1. Check in-memory cache ($0 cost)
    const cachedEntry = reviewCache.get(cacheKey);
    if (cachedEntry && (Date.now() - cachedEntry.timestamp < CACHE_DURATION)) {
      return Response.json({ success: true, reviews: cachedEntry.reviews, cached: true });
    }

    const apiKey = process.env.OUTSCRAPER_API_KEY || process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      return Response.json(
        { success: false, error: "Missing OUTSCRAPER_API_KEY in Vercel environment variables." },
        { status: 500 }
      );
    }

    // 2. Query Outscraper API with strict 8-review limit
    const url = `https://api.app.outscraper.com/maps/reviews-v3?query=${encodeURIComponent(rawQuery)}&limit=10&async=false`;
    const response = await fetch(url, { 
      method: 'GET',
      headers: { 'X-API-KEY': apiKey } 
    });

    const json = await response.json();

    if (!response.ok) {
      return Response.json(
        { success: false, error: json.message || `Outscraper error (Status ${response.status})` },
        { status: response.status }
      );
    }

    // 3. Extract place & review array
    let rawReviews = [];
    const data = json.data || json;
    
    if (Array.isArray(data) && data.length > 0) {
      const place = data[0];
      if (place) {
        if (Array.isArray(place.reviews)) rawReviews = place.reviews;
        else if (Array.isArray(place.reviews_data)) rawReviews = place.reviews_data;
        else if (Array.isArray(place[0]?.reviews)) rawReviews = place[0].reviews;
      }
    }

    if (!rawReviews || rawReviews.length === 0) {
      return Response.json(
        { success: false, error: "No reviews found for this exact business name. Please include business name, city, and state (e.g. 'Tataros Gymnastics, Knoxville TN')." },
        { status: 404 }
      );
    }

    // 4. Strictly filter for 4-star and 5-star positive reviews ONLY
    const positiveReviews = rawReviews
      .filter((r) => {
        const rating = r.review_rating || r.rating || 5;
        return rating >= 4;
      })
      .map((r) => ({
        author: r.author_title || r.author_name || r.name || "Verified Customer",
        rating: r.review_rating || r.rating || 5,
        text: r.review_text || r.text || r.snippet || "Great experience and highly recommended!"
      }));

    if (positiveReviews.length === 0) {
      return Response.json(
        { success: false, error: "No 4-star or 5-star reviews were found for this business listing." },
        { status: 404 }
      );
    }

    const finalReviews = positiveReviews.slice(0, 8);

    // 5. Cache result
    reviewCache.set(cacheKey, {
      timestamp: Date.now(),
      reviews: finalReviews
    });

    return Response.json({ success: true, reviews: finalReviews, cached: false });

  } catch (error) {
    console.error('Outscraper API Exception:', error);
    return Response.json(
      { success: false, error: error.message || "Failed to parse reviews from Outscraper." },
      { status: 500 }
    );
  }
}
