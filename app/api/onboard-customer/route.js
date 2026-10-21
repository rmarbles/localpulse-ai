import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { businessName, email } = await request.json();
    const embedScript = `<script src="https://localpulse-ai.vercel.app/widget.js" data-business="${encodeURIComponent(businessName)}"></script>`;

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'LocalPulse AI <onboarding@resend.dev>',
        to: [email],
        subject: `Your LocalPulse AI Widget Code for ${businessName}`,
        html: `
          <h2>Welcome to LocalPulse AI!</h2>
          <p>Paste the following script tag directly into your website HTML before the closing <code>&lt;/body&gt;</code> tag:</p>
          <pre style="background:#f4f4f4; padding:12px; border-radius:6px;">${embedScript}</pre>
          <p>Your review badge and quote capture system will appear automatically!</p>
        `
      })
    });

    const data = await resendResponse.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
