import { Errors } from '@hey/data/errors';
import type { NextApiRequest, NextApiResponse } from 'next';
import allowCors from 'utils/allowCors';
import createSupabaseClient from 'utils/createSupabaseClient';
import validateIsStaff from 'utils/middlewares/validateIsStaff';
import { boolean, object, string } from 'zod';

type ExtensionRequest = {
  id: string;
  enabled: boolean;
};

const validationSchema = object({
  id: string(),
  enabled: boolean()
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

  if (!(await validateIsStaff(req))) {
    return res.status(400).json({ success: false, error: Errors.NotStaff });
  }

  const { id, enabled } = body as ExtensionRequest;

  try {
    const client = createSupabaseClient();
    if (enabled) {
      const { error: upsertError } = await client
        .from('verified')
        .upsert({ id });

      if (upsertError) {
        throw upsertError;
      }

      return res.status(200).json({ success: true, enabled });
    }

    const { error: deleteError } = await client
      .from('verified')
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw deleteError;
    }

    return res.status(200).json({ success: true, enabled });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
