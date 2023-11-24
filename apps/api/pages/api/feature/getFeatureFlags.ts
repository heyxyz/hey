import { Errors } from '@hey/data/errors';
import allowCors from '@utils/allowCors';
import { CACHE_AGE_1_MIN } from '@utils/constants';
import createRedisClient from '@utils/createRedisClient';
import prisma from '@utils/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  try {
    const redis = createRedisClient();
    const cache = await redis.get(`features:${id}`);

    if (cache) {
      return res
        .status(200)
        .setHeader('Cache-Control', CACHE_AGE_1_MIN)
        .json({ success: true, cached: true, features: JSON.parse(cache) });
    }

    const data = await prisma.profileFeature.findMany({
      where: {
        profileId: id as string,
        enabled: true,
        feature: { enabled: true }
      },
      select: {
        feature: { select: { key: true } }
      }
    });

    const features = data.map((feature: any) => feature.feature?.key);
    await redis.set(`features:${id}`, JSON.stringify(features));

    return res
      .status(200)
      .setHeader('Cache-Control', CACHE_AGE_1_MIN)
      .json({ success: true, features });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
