import { Errors } from '@hey/data/errors';
import allowCors from '@utils/allowCors';
import createRedisClient from '@utils/createRedisClient';
import createSupabaseClient from '@utils/createSupabaseClient';
import validateIsStaff from '@utils/middlewares/validateIsStaff';
import type { NextApiRequest, NextApiResponse } from 'next';
import { boolean, object, string } from 'zod';

type ExtensionRequest = {
  id: string;
  enabled: boolean;
  trial: boolean;
};

const validationSchema = object({
  id: string(),
  enabled: boolean(),
  trial: boolean()
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

  const { id, enabled, trial } = body as ExtensionRequest;

  try {
    const redis = createRedisClient();
    const client = createSupabaseClient();

    if (enabled) {
      const { error: upsertError } = await client.from('pro').upsert({
        profile_id: id,
        hash: '0x00',
        expires_at: '2100-01-01T00:00:00.000Z'
      });

      if (upsertError) {
        throw upsertError;
      }

      // Delete the cache
      await redis.del(`pro:${id}`);

      return res.status(200).json({ success: true, enabled, trial });
    }

    const { error: deleteError } = await client
      .from('pro')
      .delete()
      .match({ profile_id: id });

    if (deleteError) {
      throw deleteError;
    }

    // Delete the cache
    await redis.del(`pro:${id}`);

    return res.status(200).json({ success: true, enabled, trial });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
