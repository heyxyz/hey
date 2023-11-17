import { Errors } from '@hey/data/errors';
import allowCors from '@utils/allowCors';
import { CACHE_AGE } from '@utils/constants';
import createSupabaseClient from '@utils/createSupabaseClient';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  try {
    const client = createSupabaseClient();
    const { data } = await client
      .from('pro')
      .select('id')
      .eq('profile_id', id)
      .single();

    return res
      .status(200)
      .setHeader('Cache-Control', CACHE_AGE)
      .json({ success: true, enabled: Boolean(data) });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
