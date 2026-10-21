import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { businessName, email } = await request.json();
    
    // Safely encode script characters so email clients don't strip them
    const rawScript = `<script src="https://localpulse-ai.vercel.app/widget.js" data-business="${encodeURIComponent(businessName)}"></script>`;
    const safeScriptDisplay = rawScript.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'LocalPulse AI <onboarding@resend.dev>',
        to: [email],
        subject: `Your LocalPulse AI Setup for ${businessName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #334155;">
            <h2 style="color: #0f172a;">Welcome to LocalPulse AI, ${businessName}!</h2>
            <p>Your automated review widget and lead capture system are ready to activate.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://localpulse-ai.vercel.app" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                Access Your Dashboard & Widget
              </a>
            </div>

            <p style="margin-top: 30px; font-size: 14px; color: #64748b;">If your web developer is installing it, provide them with this code snippet:</p>
            <pre style="background:#f1f5f9; padding:12px; border-radius:6px; font-size: 13px; overflow-x: auto;">${safeScriptDisplay}</pre>
          </div>
        `
      })
    });

    const data = await resendResponse.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
