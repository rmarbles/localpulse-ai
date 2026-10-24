import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { businessName, email, isDeveloperEmail, embedCode } = body;

    const appUrl = 'https://localpulse-ai-sute.vercel.app';

    if (isDeveloperEmail) {
      await resend.emails.send({
        from: 'LocalPulse AI <onboarding@resend.dev>',
        to: email,
        subject: `Website Widget Setup Code for ${businessName}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #1e293b; max-width: 600px;">
            <h2 style="color: #0f172a;">LocalPulse AI Widget Installation</h2>
            <p>Hi there,</p>
            <p>Please paste the following review widget snippet into the HTML of <strong>${businessName}</strong> right before the closing <code>&lt;/body&gt;</code> tag:</p>
            
            <div style="background-color: #f1f5f9; border: 1px solid #cbd5e1; padding: 16px; border-radius: 8px; font-family: monospace; font-size: 13px; color: #0f172a; word-break: break-all; margin: 20px 0;">
              ${embedCode ? embedCode.replace(/</g, '&lt;').replace(/>/g, '&gt;') : ''}
            </div>

            <p style="color: #64748b; font-size: 14px;">That's it! Once added, the review and SMS quote widget will display automatically on the site.</p>
          </div>
        `
      });
    } else {
      const magicLink = `${appUrl}/?business=${encodeURIComponent(businessName)}&email=${encodeURIComponent(email)}`;

      await resend.emails.send({
        from: 'LocalPulse AI <onboarding@resend.dev>',
        to: email,
        subject: `Access Your LocalPulse AI Dashboard - ${businessName}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #1e293b; max-width: 600px;">
            <h2>Welcome to LocalPulse AI, ${businessName}!</h2>
            <p>Your 14-day free trial is active. Access your personal dashboard anytime using the button below:</p>
            <p style="margin: 24px 0;">
              <a href="${magicLink}" style="background-color: #2563eb; color: #ffffff; padding: 12px 22px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
                Access Your Dashboard & Widget →
              </a>
            </p>
            <p style="color: #64748b; font-size: 13px;">Or copy and paste this URL into your browser:<br><a href="${magicLink}">${magicLink}</a></p>
          </div>
        `
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
