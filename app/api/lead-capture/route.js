import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { placeId, leadText, businessName } = await request.json();
    console.log(`New lead for ${businessName} (${placeId}): ${leadText}`);

    return NextResponse.json({ success: true, message: 'Lead captured successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
