import { Errors } from '@hey/data/errors';
import logger from '@hey/lib/logger';
import parseJwt from '@hey/lib/parseJwt';
import catchedError from '@utils/catchedError';
import { GARDENER_MODE_FEATURE_ID } from '@utils/constants';
import validateIsGardener from '@utils/middlewares/validateIsGardener';
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

  if (!(await validateIsGardener(req))) {
    return res.status(400).json({ success: false, error: Errors.NotGarnder });
  }

  const { enabled } = body as ExtensionRequest;

  try {
    const payload = parseJwt(accessToken);
    const profile_id = payload.id;

    if (enabled) {
      await prisma.profileFeature.create({
        data: { featureId: GARDENER_MODE_FEATURE_ID, profileId: profile_id }
      });
      logger.info(`Enabled gardener mode for ${profile_id}`);

      return res.status(200).json({ success: true, enabled });
    }

    await prisma.profileFeature.delete({
      where: {
        profileId_featureId: {
          featureId: GARDENER_MODE_FEATURE_ID,
          profileId: profile_id
        }
      }
    });
    logger.info(`Disabled gardener mode for ${profile_id}`);

    return res.status(200).json({ success: true, enabled });
  } catch (error) {
    return catchedError(res, error);
  }
};
