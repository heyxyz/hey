import { Errors } from '@hey/data/errors';
import parseJwt from '@hey/lib/parseJwt';
import type { NextApiRequest, NextApiResponse } from 'next';
import allowCors from 'utils/allowCors';
import createSupabaseClient from 'utils/createSupabaseClient';
import validateLensAccount from 'utils/middlewares/validateLensAccount';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const accessToken = req.headers['x-access-token'] as string;

  if (!(await validateLensAccount(req))) {
    return res
      .status(400)
      .json({ success: false, error: Errors.InvalidAccesstoken });
  }

  try {
    const payload = parseJwt(accessToken);
    const client = createSupabaseClient();
    const { data, error } = await client
      .from('membership-nft')
      .upsert({ id: payload.evmAddress, dismissedOrMinted: true })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.status(200).json({ success: true, result: data });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
