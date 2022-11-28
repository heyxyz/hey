import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { id } = req.body;
      const data = await prisma.user.upsert({
        where: { userId: id },
        create: { userId: id, proExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) },
        update: { proExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) }
      });
      return res.status(200).json({ data });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: 'Something went wrong' });
    }
  } else {
    return res.status(405).json({ msg: 'Method not allowed' });
  }
};

export default handler;
