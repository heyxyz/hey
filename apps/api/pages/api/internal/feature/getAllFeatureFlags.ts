import allowCors from '@utils/allowCors';
import { CACHE_AGE_1_MIN } from '@utils/constants';
import prisma from '@utils/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = await prisma.feature.findMany({
      orderBy: { priority: 'desc' }
    });

    return res
      .status(200)
      .setHeader('Cache-Control', CACHE_AGE_1_MIN)
      .json({ success: true, features: data });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
