import type { NextApiRequest, NextApiResponse } from 'next';
import allowCors from 'utils/allowCors';
import { CACHE_AGE } from 'utils/constants';
import createRedisClient from 'utils/createRedisClient';
import createSupabaseClient from 'utils/createSupabaseClient';

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    const redis = createRedisClient();
    const cache = await redis.get('verified');

    if (!cache) {
      const client = createSupabaseClient();
      const { data, error } = await client.from('verified').select('*');

      if (error) {
        throw error;
      }

      const ids = data.map((item) => item.id);
      await redis.set('verified', JSON.stringify(ids));

      return res
        .status(200)
        .setHeader('Cache-Control', CACHE_AGE)
        .json({ success: true, result: ids });
    }

    return res
      .status(200)
      .setHeader('Cache-Control', CACHE_AGE)
      .json({ success: true, cached: true, result: JSON.parse(cache) });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
