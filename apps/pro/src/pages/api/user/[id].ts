import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const { id } = req.query;
      if (id) {
        const data = await prisma.user.findFirst({
          where: { userId: id as string }
        });

        // Set cache for 1 day
        res.setHeader('Cache-Control', 's-maxage=86400');

        if (data?.proExpiresAt) {
          return res.status(200).json({ isPro: data?.proExpiresAt > new Date() });
        }

        return res.status(200).json({ isPro: false });
      }

      return res.status(200).json({ message: 'User ID is empty' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
};

export default handler;
