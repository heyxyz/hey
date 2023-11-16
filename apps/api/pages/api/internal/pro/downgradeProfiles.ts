import { Errors } from '@hey/data/errors';
import type { NextApiRequest, NextApiResponse } from 'next';
import allowCors from 'utils/allowCors';
import createSupabaseClient from 'utils/createSupabaseClient';
import { object, string } from 'zod';

type ExtensionRequest = {
  secret: string;
};

const validationSchema = object({
  secret: string()
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;

  if (!body) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return res.status(400).json({ success: false, error: Errors.InvalidBody });
  }

  const { secret } = body as ExtensionRequest;

  if (secret !== process.env.SECRET) {
    return res
      .status(400)
      .json({ success: false, error: Errors.InvalidSecret });
  }

  try {
    const client = createSupabaseClient();
    const { error } = await client
      .from('pro')
      .delete()
      .lte('expires_at', new Date().toISOString());

    if (error) {
      throw error;
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
