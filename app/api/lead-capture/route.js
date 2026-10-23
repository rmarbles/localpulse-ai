import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { leadText, businessName } = await req.json();

    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'LocalPulse AI <onboarding@resend.dev>',
        to: 'owner@yourbusiness.com', // Placeholder for lead notifications
        subject: `🔥 New Lead Captured for ${businessName}!`,
        html: `<p><strong>Lead Details:</strong> ${leadText}</p>`
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Lead capture error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
