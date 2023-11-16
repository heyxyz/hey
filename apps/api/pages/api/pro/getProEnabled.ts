import { Errors } from '@hey/data/errors';
import type { NextApiRequest, NextApiResponse } from 'next';
import allowCors from 'utils/allowCors';
import createSupabaseClient from 'utils/createSupabaseClient';

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

    return res.status(200).json({ success: true, enabled: Boolean(data) });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
