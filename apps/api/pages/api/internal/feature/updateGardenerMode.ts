import { Errors } from '@hey/data/errors';
import parseJwt from '@hey/lib/parseJwt';
import allowCors from '@utils/allowCors';
import { GARDENER_MODE_FEATURE_ID } from '@utils/constants';
import createRedisClient from '@utils/createRedisClient';
import createSupabaseClient from '@utils/createSupabaseClient';
import validateIsGardener from '@utils/middlewares/validateIsGardener';
import type { NextApiRequest, NextApiResponse } from 'next';
import { boolean, object } from 'zod';

type ExtensionRequest = {
  enabled: boolean;
};

const validationSchema = object({
  enabled: boolean()
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;

  if (!body) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  const accessToken = req.headers['x-access-token'] as string;
  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return res.status(400).json({ success: false, error: Errors.InvalidBody });
  }

  if (!(await validateIsGardener(req))) {
    return res.status(400).json({ success: false, error: Errors.NotGarnder });
  }

  const { enabled } = body as ExtensionRequest;

  try {
    const payload = parseJwt(accessToken);
    const profile_id = payload.id;
    const redis = createRedisClient();
    const client = createSupabaseClient();

    if (enabled) {
      const { error: upsertError } = await client
        .from('profile-features')
        .upsert({ feature_id: GARDENER_MODE_FEATURE_ID, profile_id });

      if (upsertError) {
        throw upsertError;
      }

      // Delete the cache
      await redis.del(`features:${profile_id}`);

      return res.status(200).json({ success: true, enabled });
    }

    const { error: deleteError } = await client
      .from('profile-features')
      .delete()
      .eq('feature_id', GARDENER_MODE_FEATURE_ID)
      .eq('profile_id', profile_id);

    if (deleteError) {
      throw deleteError;
    }

    // Delete the cache
    await redis.del(`features:${profile_id}`);

    return res.status(200).json({ success: true, enabled });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
