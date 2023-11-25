import { Errors } from '@hey/data/errors';
import allowCors from '@utils/allowCors';
import catchedError from '@utils/catchedError';
import createRedisClient from '@utils/createRedisClient';
import validateIsStaff from '@utils/middlewares/validateIsStaff';
import prisma from '@utils/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
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

  if (!(await validateIsStaff(req))) {
    return res.status(400).json({ success: false, error: Errors.NotStaff });
  }

  const { id, profile_id, enabled } = body as ExtensionRequest;

  try {
    const redis = createRedisClient();

    if (enabled) {
      await prisma.profileFeature.create({
        data: { featureId: id, profileId: profile_id }
      });
      // Delete the cache
      await redis.del(`features:${profile_id}`);

      return res.status(200).json({ success: true, enabled });
    }

    await prisma.profileFeature.delete({
      where: { profileId_featureId: { featureId: id, profileId: profile_id } }
    });

    // Delete the cache
    await redis.del(`features:${profile_id}`);

    return res.status(200).json({ success: true, enabled });
  } catch (error) {
    return catchedError(res, error);
  }
};

export default allowCors(handler);
