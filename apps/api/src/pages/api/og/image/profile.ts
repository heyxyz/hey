import { getOGImage } from '@lib/api/getOGImage';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Invalid method!' });
  }

  const data = JSON.parse(unescape(atob(req.query.data as string)));
  try {
    return res
      .setHeader('Content-Type', 'image/png')
      .setHeader('Cache-Control', 's-maxage=86400')
      .send(await getOGImage(data));
  } catch (error) {
    return res
      .setHeader('Content-Type', 'image/png')
      .setHeader('Cache-Control', 's-maxage=86400')
      .send(getOGImage(data));
  }
};

export default handler;
