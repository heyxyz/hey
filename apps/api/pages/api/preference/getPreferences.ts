import { Errors } from '@hey/data/errors';
import type { NextApiRequest, NextApiResponse } from 'next';
import allowCors from 'utils/allowCors';
import { CACHE_AGE } from 'utils/constants';
import createSupabaseClient from 'utils/createSupabaseClient';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  try {
    const client = createSupabaseClient();
    const { data } = await client
      .from('preferences')
      .select('*')
      .eq('id', id)
      .single();

    return res.status(200).setHeader('Cache-Control', CACHE_AGE).json({
      success: true,
      result: data
    });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
