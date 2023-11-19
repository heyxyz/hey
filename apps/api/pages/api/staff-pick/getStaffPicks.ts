import allowCors from '@utils/allowCors';
import { CACHE_AGE } from '@utils/constants';
import createRedisClient from '@utils/createRedisClient';
import prisma from '@utils/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    const redis = createRedisClient();
    const cache = await redis.get('staff-picks');

    if (cache) {
      return res
        .status(200)
        .setHeader('Cache-Control', CACHE_AGE)
        .json({ success: true, cached: true, result: JSON.parse(cache) });
    }

    const data = await prisma.staffPick.findMany({
      where: { score: { not: 0 } },
      orderBy: { score: 'desc' },
      take: 5
    });
    await redis.set('staff-picks', JSON.stringify(data));

    return res
      .status(200)
      .setHeader('Cache-Control', CACHE_AGE)
      .json({ success: true, result: data });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
