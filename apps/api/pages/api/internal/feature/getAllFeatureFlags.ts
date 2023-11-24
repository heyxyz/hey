import allowCors from '@utils/allowCors';
import { SWR_CACHE_AGE_30_DAYS } from '@utils/constants';
import prisma from '@utils/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = await prisma.feature.findMany({
      orderBy: { priority: 'desc' }
    });

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_30_DAYS)
      .json({ success: true, features: data });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
