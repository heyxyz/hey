import { Errors } from '@hey/data/errors';
import allowCors from '@utils/allowCors';
import { CACHE_AGE } from '@utils/constants';
import createRedisClient from '@utils/createRedisClient';
import createSupabaseClient from '@utils/createSupabaseClient';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  try {
    const redis = createRedisClient();
    const cache = await redis.get(`preferences:${id}`);

    if (cache) {
      return res
        .status(200)
        .setHeader('Cache-Control', CACHE_AGE)
        .json({ success: true, cached: true, result: JSON.parse(cache) });
    }

    const client = createSupabaseClient();
    const { data } = await client
      .from('preferences')
      .select('*')
      .eq('id', id)
      .single();
    await redis.set(`preferences:${id}`, JSON.stringify(data));

    return res.status(200).setHeader('Cache-Control', CACHE_AGE).json({
      success: true,
      result: data
    });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
