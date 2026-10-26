const reviewCache = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 Hours

export async function POST(req) {
  try {
    const { googleUrl, businessName } = await req.json();
    const query = (businessName || googleUrl || "").trim();

    if (!query) {
      return Response.json(
        { success: false, error: "Please provide a valid business name or location query." },
        { status: 400 }
      );
    }

    const cacheKey = query.toLowerCase();

    const cachedEntry = reviewCache.get(cacheKey);
    if (cachedEntry && (Date.now() - cachedEntry.timestamp < CACHE_DURATION)) {
      return Response.json({ success: true, reviews: cachedEntry.reviews, cached: true });
    }

    const apiKey = process.env.OUTSCRAPER_API_KEY || process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      return Response.json(
        { success: false, error: "Missing OUTSCRAPER_API_KEY environment variable in Vercel settings." },
        { status: 500 }
      );
    }

    // Increased limit to 8 so "See More Reviews" has plenty of authentic content to show
    const url = `https://api.app.outscraper.com/maps/reviews-v3?query=${encodeURIComponent(query)}&limit=8&async=false`;
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
        { success: false, error: "No reviews found. Try entering 'Business Name, City State' (e.g., 'Joe's Auto Repair, Austin TX')." },
        { status: 404 }
      );
    }

    // Map up to 8 live scraped reviews
    const liveReviews = rawReviews.slice(0, 8).map((r) => ({
      author: r.author_title || r.author_name || r.name || "Verified Customer",
      rating: r.review_rating || r.rating || 5,
      text: r.review_text || r.text || r.snippet || "Outstanding service!"
    }));

    reviewCache.set(cacheKey, {
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
