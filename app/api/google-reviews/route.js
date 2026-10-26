export async function POST(req) {
  try {
    const { googleUrl, businessName } = await req.json();
    const apiKey = process.env.OUTSCRAPER_API_KEY || process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
      return Response.json(
        { success: false, error: "Missing OUTSCRAPER_API_KEY environment variable in Vercel settings." },
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
        { success: false, error: json.message || `Outscraper API error (Status ${response.status})` },
        { status: response.status }
      );
    }

    // Extract actual reviews from Outscraper's response structure
    let rawReviews = [];
    const dataField = json.data || json;

    if (Array.isArray(dataField) && dataField.length > 0) {
      const firstItem = dataField[0];
      if (firstItem && Array.isArray(firstItem.reviews)) {
        rawReviews = firstItem.reviews;
      } else if (firstItem && Array.isArray(firstItem.reviews_data)) {
        rawReviews = firstItem.reviews_data;
      } else if (Array.isArray(dataField[0])) {
        const inner = dataField[0][0];
        if (inner && Array.isArray(inner.reviews)) {
          rawReviews = inner.reviews;
        }
      }
    }

    if (!rawReviews || rawReviews.length === 0) {
      return Response.json(
        { success: false, error: "Outscraper returned no reviews for this query. Try using the exact business name and city (e.g., 'Joe's Bakery, Austin TX') instead of a short link." },
        { status: 404 }
      );
    }

    // Map the actual scraped reviews cleanly
    const liveReviews = rawReviews.slice(0, 3).map((r) => ({
      author: r.author_title || r.author_name || "Google User",
      rating: r.review_rating || r.rating || 5,
      text: r.review_text || r.text || "No comment provided."
    }));

    return Response.json({ success: true, reviews: liveReviews });

  } catch (error) {
    console.error('Outscraper API Exception:', error);
    return Response.json(
      { success: false, error: error.message || "Failed to establish connection with Outscraper API." },
      { status: 500 }
    );
  }
}
