import { kv } from '@vercel/kv';
import type { NextApiRequest, NextApiResponse } from 'next';
import allowCors from 'utils/allowCors';
import { KV_VERIFIED_PROFILES } from 'utils/constants';
import createSupabaseClient from 'utils/createSupabaseClient';

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    const cache = await kv.get(KV_VERIFIED_PROFILES);

    if (!cache) {
      const client = createSupabaseClient();
      const { data, error } = await client.from('verified').select('*');

      if (error) {
        throw error;
      }

      const ids = data.map((item) => item.id);
      await kv.set('list', ids);

      return res
        .status(200)
        .setHeader(
          'Cache-Control',
          'public, s-maxage=1, stale-while-revalidate=59'
        )
        .json({ success: true, result: ids });
    }

    return res
      .status(200)
      .setHeader(
        'Cache-Control',
        'public, s-maxage=1, stale-while-revalidate=59'
      )
      .json({ success: true, fromKv: true, result: cache });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
