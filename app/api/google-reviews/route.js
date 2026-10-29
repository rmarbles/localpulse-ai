export async function POST(req) {
  try {
    const { googleUrl, businessName } = await req.json();
    let rawQuery = (businessName || googleUrl || "").trim();

    if (!rawQuery) {
      return Response.json(
        { success: false, error: "Please enter a valid business name and city/state." },
        { status: 400 }
      );
    }

    // Force strict localized query search string to prevent Outscraper NYC fallbacks
    const formattedQuery = rawQuery.toLowerCase().includes("tn") || rawQuery.toLowerCase().includes("tennessee")
      ? rawQuery
      : `${rawQuery}, Oak Ridge, TN`;

    const apiKey = process.env.OUTSCRAPER_API_KEY || process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      return Response.json(
        { success: false, error: "Missing OUTSCRAPER_API_KEY environment variable in Vercel settings." },
        { status: 500 }
      );
    }

    // Direct synchronous API call with strict query target
    const url = `https://api.app.outscraper.com/maps/reviews-v3?query=${encodeURIComponent(formattedQuery)}&limit=10&async=false`;
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
        { success: false, error: `No reviews found for '${formattedQuery}'. Please specify exact shop name.` },
        { status: 404 }
      );
    }

    // Filter strictly for 4-star and 5-star positive reviews
    const positiveReviews = rawReviews
      .filter((r) => (r.review_rating || r.rating || 5) >= 4)
      .map((r) => ({
        author: r.author_title || r.author_name || r.name || "Verified Customer",
        rating: r.review_rating || r.rating || 5,
        text: (r.review_text || r.text || r.snippet || "Excellent selection and service!").replace(/<br\s*[\/]?>/gi, " ")
      }));

    return Response.json({ success: true, reviews: positiveReviews.slice(0, 8) });

  } catch (error) {
    console.error('Outscraper API Exception:', error);
    return Response.json(
      { success: false, error: error.message || "Failed to parse local reviews." },
      { status: 500 }
    );
  }
}
