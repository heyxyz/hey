import allowCors from '@utils/allowCors';
import { CACHE_AGE_59 } from '@utils/constants';
import createRedisClient from '@utils/createRedisClient';
import prisma from '@utils/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    const redis = createRedisClient();
    const cache = await redis.get('verified');

    if (cache) {
      return res
        .status(200)
        .setHeader('Cache-Control', CACHE_AGE_59)
        .json({ success: true, cached: true, result: JSON.parse(cache) });
    }

    const data = await prisma.verified.findMany({
      select: { id: true }
    });

    const ids = data.map((item: any) => item.id);
    await redis.set('verified', JSON.stringify(ids));

    return res
      .status(200)
      .setHeader('Cache-Control', CACHE_AGE_59)
      .json({ success: true, result: ids });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
