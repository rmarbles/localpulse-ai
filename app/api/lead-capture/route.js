import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { leadText, businessName, contractorPhone, contractorEmail } = await req.json();

    // 1. Send Email Alert to Business Owner
    if (contractorEmail) {
      await resend.emails.send({
        from: 'LocalPulse Leads <leads@resend.dev>',
        to: contractorEmail,
        subject: `⚡ NEW HOT LEAD: ${businessName}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #1e293b; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #2563eb; margin-top: 0;">New Quote Request Captured!</h2>
            <p><strong>Business:</strong> ${businessName}</p>
            <p style="font-size: 16px; background: #f8fafc; padding: 12px; border-radius: 6px; border-left: 4px solid #2563eb;">
              ${leadText}
            </p>
            <p style="color: #64748b; font-size: 13px;">Respond within 5 minutes to maximize your conversion rate!</p>
          </div>
        `
      });
    }

    return Response.json({ success: true, message: 'Lead dispatched successfully' });
  } catch (error) {
    console.error('Lead Capture Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
