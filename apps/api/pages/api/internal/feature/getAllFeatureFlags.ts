import type { NextApiRequest, NextApiResponse } from 'next';
import allowCors from 'utils/allowCors';
import createSupabaseClient from 'utils/createSupabaseClient';

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

    return res.status(200).json({ success: true, features: data });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
