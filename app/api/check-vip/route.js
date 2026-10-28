import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) return Response.json({ isVip: false });

    // Read the secure VIP config file
    const filePath = path.join(process.cwd(), 'config', 'vip-passes.json');
    if (!fs.existsSync(filePath)) {
      return Response.json({ isVip: false });
    }

    const fileData = fs.readFileSync(filePath, 'utf8');
    const vipPasses = JSON.parse(fileData);

    const userPass = vipPasses[email.toLowerCase().trim()];
    if (!userPass) {
      return Response.json({ isVip: false });
    }

    // Check if pass has expired
    const currentDate = new Date();
    const expiryDate = new Date(userPass.expiresAt);

    if (currentDate <= expiryDate) {
      return Response.json({ 
        isVip: true, 
        tier: userPass.tier, 
        expiresAt: userPass.expiresAt 
      });
    } else {
      return Response.json({ isVip: false, reason: "Expired" });
    }

  } catch (err) {
    return Response.json({ isVip: false, error: err.message });
  }
}
