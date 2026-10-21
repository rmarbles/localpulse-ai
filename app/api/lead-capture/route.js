 import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { businessName, ownerEmail, leadText } = await request.json();
    
    // Sends an instant email notification alert to the business owner via Resend
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'LocalPulse AI <alerts@resend.dev>',
        to: [ownerEmail || 'owner@yourbusiness.com'],
        subject: `🔥 New Lead from your website! (${businessName})`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #334155; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">New Fast Quote Request!</h2>
            <p>A website visitor just submitted a request on your LocalPulse widget for <strong>${businessName}</strong>:</p>
            
            <blockquote style="background: #f8fafc; border-left: 4px solid #2563eb; margin: 20px 0; padding: 16px; font-size: 16px; color: #0f172a;">
              "${leadText}"
            </blockquote>
            
            <p style="font-size: 14px; color: #64748b;">Follow up with this lead immediately to maximize your closing rate!</p>
          </div>
        `
      })
    });
    
    return NextResponse.json({ success: true, message: 'Lead notification sent!' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
