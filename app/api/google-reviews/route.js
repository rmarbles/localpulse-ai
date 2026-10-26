// Simple in-memory cache map to store reviews temporarily ($0 cost, ultra-fast)
const reviewCache = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 Hours

export async function POST(req) {
  try {
    const { googleUrl, businessName } = await req.json();
    const query = (businessName || googleUrl || "").trim().toLowerCase();

    if (!query) {
      return Response.json(
        { success: false, error: "Please provide a valid business name or location query." },
        { status: 400 }
      );
    }

    // 1. Check if we already have fresh reviews cached for this query ($0 API cost, instant speed)
    const cachedEntry = reviewCache.get(query);
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

    // 2. Query Outscraper API directly
    const url = `https://api.app.outscraper.com/maps/reviews-v3?query=${encodeURIComponent(query)}&limit=5&async=false`;
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

    // 3. Extract review payload across possible Outscraper data structures
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
        { success: false, error: "No reviews found for this business query. Try entering 'Business Name, City State' (e.g., 'Joe's Auto Repair, Austin TX')." },
        { status: 404 }
      );
    }

    // 4. Map real reviews cleanly
    const liveReviews = rawReviews.slice(0, 3).map((r) => ({
      author: r.author_title || r.author_name || r.name || "Google User",
      rating: r.review_rating || r.rating || 5,
      text: r.review_text || r.text || r.snippet || "Great service!"
    }));

    // 5. Save into in-memory cache for instant subsequent requests
    reviewCache.set(query, {
      timestamp: Date.now(),
      reviews: liveReviews
    });

    return Response.json({ success: true, reviews: liveReviews, cached: false });

  } catch (error) {
    console.error('Outscraper API Exception:', error);
    return Response.json(
      { success: false, error: error.message || "Failed to parse reviews from Outscraper." },
      { status: 500 }
    );
  }
}
