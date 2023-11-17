import allowCors from '@utils/allowCors';
import { CACHE_AGE } from '@utils/constants';
import createSupabaseClient from '@utils/createSupabaseClient';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = createSupabaseClient();

    const { data, error } = await client
      .from('features')
      .select('*')
      .order('priority', { ascending: false });

    if (error) {
      throw error;
    }

    return res
      .status(200)
      .setHeader('Cache-Control', CACHE_AGE)
      .json({ success: true, features: data });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
