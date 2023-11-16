import { Errors } from '@hey/data/errors';
import { kv } from '@vercel/kv';
import type { NextApiRequest, NextApiResponse } from 'next';
import allowCors from 'utils/allowCors';
import createSupabaseClient from 'utils/createSupabaseClient';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  try {
    const cacheKey = `features:${id}`;
    const cache = await kv.get(cacheKey);

    if (!cache) {
      const client = createSupabaseClient();
      const { data, error } = await client
        .from('profile-features')
        .select('profile_id, enabled, features!inner(key, enabled)')
        .eq('features.enabled', true)
        .eq('profile_id', id)
        .eq('enabled', true);

      if (error) {
        throw error;
      }

      const features = data.map((feature: any) => feature.features?.key);
      await kv.set(cacheKey, features);

      return res.status(200).json({ success: true, features });
    }

    return res.status(200).json({
      success: true,
      fromKV: true,
      features: cache
    });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
