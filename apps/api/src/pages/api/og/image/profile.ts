import { getOGImage } from '@lib/api/getOGImage';
import type { NextApiResponse } from 'next';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
export const config = {
  runtime: 'experimental-edge'
};

const handler = async (req: NextRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Invalid method!' });
  }
  try {
    const url = req.url as string;
    const data = url.split('?data=')[1];
    const base64ProfileData = Buffer.from(unescape(data) as string, 'base64').toString();
    const profileData = JSON.parse(base64ProfileData);
    return await getOGImage(profileData);
  } catch (error) {
    console.error('Couldnt generate og image', error);
    return NextResponse.json({
      response: `Sorry ser the URL you are looking for is not available`
    });
  }
};

export default handler;
