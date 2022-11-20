import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  return res.setHeader('Content-Type', 'text/html').setHeader('Cache-Control', 's-maxage=86400').send('gm');
};

export default handler;
