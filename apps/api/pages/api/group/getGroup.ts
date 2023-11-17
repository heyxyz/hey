import { Errors } from '@hey/data/errors';
import allowCors from '@utils/allowCors';
import { CACHE_AGE } from '@utils/constants';
import createSupabaseClient from '@utils/createSupabaseClient';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  try {
    const client = createSupabaseClient();
    const { data } = await client
      .from('groups')
      .select('*')
      .eq('slug', slug)
      .single();

    return res
      .status(200)
      .setHeader('Cache-Control', CACHE_AGE)
      .json({ success: true, result: data });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
