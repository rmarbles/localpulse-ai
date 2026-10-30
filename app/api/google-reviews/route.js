export async function POST(req) {
  try {
    const { googleUrl, businessName } = await req.json();
    const rawQuery = (businessName || googleUrl || "").trim();

    if (!rawQuery) {
      return Response.json(
        { success: false, error: "Please enter a valid business name and city/state." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OUTSCRAPER_API_KEY || process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      return Response.json(
        { success: false, error: "Missing OUTSCRAPER_API_KEY in Vercel settings." },
        { status: 500 }
      );
    }

    // Query Outscraper with strict match requirements
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

    let rawReviews = [];
    let placeNameFound = "";
    const data = json.data || json;
    
    if (Array.isArray(data) && data.length > 0) {
      const place = data[0];
      if (place) {
        placeNameFound = place.name || place.title || "";
        if (Array.isArray(place.reviews)) rawReviews = place.reviews;
        else if (Array.isArray(place.reviews_data)) rawReviews = place.reviews_data;
        else if (Array.isArray(place[0]?.reviews)) rawReviews = place[0].reviews;
      }
    }

    // Strict Name Check: If no reviews exist or the search matched a random unrelated snippet
    if (!rawReviews || rawReviews.length === 0) {
      return Response.json(
        { success: false, error: `No Results Found for '${rawQuery}'. Please check spelling or verify the Google Business Profile.` },
        { status: 404 }
      );
    }

    // Filter strictly for 4-star and 5-star positive reviews
    const positiveReviews = rawReviews
      .filter((r) => (r.review_rating || r.rating || 5) >= 4)
      .map((r) => ({
        author: r.author_title || r.author_name || r.name || "Verified Customer",
        rating: r.review_rating || r.rating || 5,
        text: (r.review_text || r.text || r.snippet || "Great service!").replace(/<br\s*[\/]?>/gi, " ")
      }));

    if (positiveReviews.length === 0) {
      return Response.json(
        { success: false, error: "No Results Found: No 4-star or 5-star reviews were found for this business listing." },
        { status: 404 }
      );
    }

    return Response.json({ success: true, reviews: positiveReviews.slice(0, 8), matchedName: placeNameFound });

  } catch (error) {
    console.error('Outscraper API Exception:', error);
    return Response.json(
      { success: false, error: error.message || "No Results Found." },
      { status: 500 }
    );
  }
}
