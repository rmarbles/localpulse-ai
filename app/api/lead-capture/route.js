export async function POST(req) {
  try {
    const { leadText, businessName } = await req.json();
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      // Graceful fallback if Resend key isn't added yet
      return Response.json({ success: true, logged: true });
    }

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: 'LocalPulse AI <leads@localpulse.ai>',
        to: process.env.NOTIFICATION_EMAIL || 'owner@yourbusiness.com',
        subject: `🚨 New Quote Request for ${businessName || 'Your Business'}!`,
        html: `<h2>New Lead Received</h2><p><strong>Details:</strong> ${leadText}</p><p>Please respond to this customer immediately.</p>`
      })
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Lead Capture Error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
