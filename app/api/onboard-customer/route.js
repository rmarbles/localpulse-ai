import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { businessName, email } = await request.json();
    
    // Magic Dashboard Login Link
    const dashboardUrl = `https://localpulse-ai.vercel.app?business=${encodeURIComponent(businessName)}&email=${encodeURIComponent(email)}`;
    const embedScript = `<script src="https://localpulse-ai.vercel.app/widget.js" data-business="${encodeURIComponent(businessName)}"></script>`;
    const safeScriptDisplay = embedScript.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'LocalPulse AI <onboarding@resend.dev>',
        to: [email],
        subject: `Your LocalPulse AI Dashboard Link for ${businessName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #334155;">
            <h2 style="color: #0f172a;">Welcome to LocalPulse AI!</h2>
            <p>Your review badge and quote capture widget are ready to activate for <strong>${businessName}</strong>.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${dashboardUrl}" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                Access Your Dashboard & Widget
              </a>
            </div>

            <p style="font-size: 14px; color: #64748b;">Or copy your embed snippet directly:</p>
            <pre style="background:#f1f5f9; padding:12px; border-radius:6px; font-size: 13px; overflow-x: auto;">${safeScriptDisplay}</pre>
          </div>
        `
      })
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
