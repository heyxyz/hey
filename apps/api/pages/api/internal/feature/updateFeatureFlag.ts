import { Errors } from '@hey/data/errors';
import { kv } from '@vercel/kv';
import type { NextApiRequest, NextApiResponse } from 'next';
import allowCors from 'utils/allowCors';
import createSupabaseClient from 'utils/createSupabaseClient';
import validateIsStaff from 'utils/middlewares/validateIsStaff';
import validateLensAccount from 'utils/middlewares/validateLensAccount';
import { boolean, object, string } from 'zod';

type ExtensionRequest = {
  id: string;
  profile_id: string;
  enabled: boolean;
};

const validationSchema = object({
  id: string(),
  profile_id: string(),
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

  if (!(await validateLensAccount(req)) && !(await validateIsStaff(req))) {
    return res.status(400).json({ success: false, error: Errors.NotStaff });
  }

  const { id, profile_id, enabled } = body as ExtensionRequest;

  const clearCache = async () => {
    await kv.del(`features:${profile_id}`);
  };

  try {
    const client = createSupabaseClient();
    if (enabled) {
      const { error: upsertError } = await client
        .from('profile-features')
        .upsert({ feature_id: id, profile_id: profile_id })
        .select();

      if (upsertError) {
        throw upsertError;
      }

      await clearCache();

      return res.status(200).json({ success: true, enabled });
    }

    const { error: deleteError } = await client
      .from('profile-features')
      .delete()
      .eq('feature_id', id)
      .eq('profile_id', profile_id)
      .select();

    if (deleteError) {
      throw deleteError;
    }

    await clearCache();

    return res.status(200).json({ success: true, enabled });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
