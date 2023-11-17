import allowCors from '@utils/allowCors';
import { CACHE_AGE } from '@utils/constants';
import createSupabaseClient from '@utils/createSupabaseClient';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = createSupabaseClient();
    const { data } = await client
      .from('staff-picks')
      .select('*')
      .neq('score', 0)
      .order('score', { ascending: false })
      .limit(10);

    return res
      .status(200)
      .setHeader('Cache-Control', CACHE_AGE)
      .json({ success: true, result: data });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
