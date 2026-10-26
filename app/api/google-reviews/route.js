export async function POST(req) {
  try {
    const { googleUrl, businessName } = await req.json();
    const apiKey = process.env.OUTSCRAPER_API_KEY || process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
      return Response.json(
        { success: false, error: "Missing OUTSCRAPER_API_KEY in Vercel environment variables." },
        { status: 500 }
      );
    }

    const query = googleUrl || businessName;
    const url = `https://api.app.outscraper.com/maps/reviews-v3?query=${encodeURIComponent(query)}&limit=5&async=false`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-API-KEY': apiKey
      }
    });

    const json = await response.json();

    if (!response.ok) {
      return Response.json(
        { success: false, error: json.message || `Outscraper error (Status ${response.status})` },
        { status: response.status }
      );
    }

    // Comprehensive search for review arrays in Outscraper response
    let rawReviews = [];
    
    // Check standard data array
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
        { success: false, error: "Outscraper found the location but returned 0 reviews. Try pasting the exact business name and city (e.g., 'Joe's Auto Repair, Austin TX') instead of a short maps link." },
        { status: 404 }
      );
    }

    const liveReviews = rawReviews.slice(0, 3).map((r) => ({
      author: r.author_title || r.author_name || r.name || "Google Reviewer",
      rating: r.review_rating || r.rating || 5,
      text: r.review_text || r.text || r.snippet || "Great service!"
    }));

    return Response.json({ success: true, reviews: liveReviews });

  } catch (error) {
    console.error('Outscraper API Exception:', error);
    return Response.json(
      { success: false, error: error.message || "Failed to parse reviews from Outscraper." },
      { status: 500 }
    );
  }
}
