import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { businessName, email, isDeveloperEmail, embedCode } = body;

    // Use your exact live Vercel URL
    const appUrl = 'https://localpulse-ai.vercel.app';

    if (isDeveloperEmail) {
      // Sending installation instructions to the web developer
      await resend.emails.send({
        from: 'LocalPulse AI <onboarding@resend.dev>',
        to: email,
        subject: `Website Widget Setup Instructions for ${businessName}`,
        html: `
          <h2>LocalPulse AI Widget Setup Instructions</h2>
          <p>Hi there,</p>
          <p>Please add the following review widget snippet to the HTML of <strong>${businessName}</strong> before the closing <code>&lt;/body&gt;</code> tag:</p>
          <pre style="background: #f1f5f9; padding: 12px; border-radius: 6px;">${embedCode}</pre>
          <p>If you have any questions, reply directly to this email.</p>
        `
      });
    } else {
      // Sending magic dashboard access link to the business owner
      const magicLink = `${appUrl}/?business=${encodeURIComponent(businessName)}&email=${encodeURIComponent(email)}`;

      await resend.emails.send({
        from: 'LocalPulse AI <onboarding@resend.dev>',
        to: email,
        subject: `Access Your LocalPulse AI Dashboard - ${businessName}`,
        html: `
          <h2>Welcome to LocalPulse AI, ${businessName}!</h2>
          <p>Your 14-day free trial is active. You can manage your widget and view settings anytime using your personal dashboard link below:</p>
          <p style="margin: 20px 0;">
            <a href="${magicLink}" style="background-color: #2563eb; color: #ffffff; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
              Access Your Dashboard & Widget →
            </a>
          </p>
          <p style="color: #64748b; font-size: 13px;">Or copy and paste this URL into your browser:<br>${magicLink}</p>
        `
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
