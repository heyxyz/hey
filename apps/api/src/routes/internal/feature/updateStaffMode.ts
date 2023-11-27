import { Errors } from '@hey/data/errors';
import logger from '@hey/lib/logger';
import parseJwt from '@hey/lib/parseJwt';
import catchedError from '@utils/catchedError';
import { STAFF_MODE_FEATURE_ID } from '@utils/constants';
import createRedisClient from '@utils/createRedisClient';
import validateIsStaff from '@utils/middlewares/validateIsStaff';
import prisma from '@utils/prisma';
import type { Handler } from 'express';
import { boolean, object } from 'zod';

type ExtensionRequest = {
  enabled: boolean;
};

const validationSchema = object({
  enabled: boolean()
});

export const post: Handler = async (req, res) => {
  const { body } = req;

  if (!body) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  const accessToken = req.headers['x-access-token'] as string;
  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return res.status(400).json({ success: false, error: Errors.InvalidBody });
  }

  if (!(await validateIsStaff(req))) {
    return res.status(400).json({ success: false, error: Errors.NotStaff });
  }

  const { enabled } = body as ExtensionRequest;

  try {
    const payload = parseJwt(accessToken);
    const profile_id = payload.id;
    const redis = createRedisClient();

    if (enabled) {
      await prisma.profileFeature.create({
        data: { featureId: STAFF_MODE_FEATURE_ID, profileId: profile_id }
      });
      // Delete the cache
      await redis.del(`preferences:${profile_id}`);
      logger.info(`Enabled staff mode for ${profile_id}`);

      return res.status(200).json({ success: true, enabled });
    }

    await prisma.profileFeature.delete({
      where: {
        profileId_featureId: {
          featureId: STAFF_MODE_FEATURE_ID,
          profileId: profile_id
        }
      }
    });
    // Delete the cache
    await redis.del(`preferences:${profile_id}`);
    logger.info(`Disabled staff mode for ${profile_id}`);

    return res.status(200).json({ success: true, enabled });
  } catch (error) {
    return catchedError(res, error);
  }
};
