import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import parseJwt from '@hey/lib/parseJwt';
import catchedError from 'src/lib/catchedError';
import { STAFF_MODE_FEATURE_ID } from 'src/lib/constants';
import heyPrisma from 'src/lib/heyPrisma';
import validateIsStaff from 'src/lib/middlewares/validateIsStaff';
import { invalidBody, noBody, notAllowed } from 'src/lib/responses';
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
    return noBody(res);
  }

  const accessToken = req.headers['x-access-token'] as string;
  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return invalidBody(res);
  }

  if (!(await validateIsStaff(req))) {
    return notAllowed(res);
  }

  const { enabled } = body as ExtensionRequest;

  try {
    const payload = parseJwt(accessToken);
    const profile_id = payload.id;

    if (enabled) {
      await heyPrisma.profileFeature.create({
        data: { featureId: STAFF_MODE_FEATURE_ID, profileId: profile_id }
      });
      logger.info(`Enabled staff mode for ${profile_id}`);

      return res.status(200).json({ enabled, success: true });
    }

    await heyPrisma.profileFeature.delete({
      where: {
        profileId_featureId: {
          featureId: STAFF_MODE_FEATURE_ID,
          profileId: profile_id
        }
      }
    });
    logger.info(`Disabled staff mode for ${profile_id}`);

    return res.status(200).json({ enabled, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
