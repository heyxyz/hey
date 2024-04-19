import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import heyPrisma from 'src/lib/heyPrisma';
import validateIsStaff from 'src/lib/middlewares/validateIsStaff';
import { invalidBody, noBody, notAllowed } from 'src/lib/responses';
import { boolean, object, string } from 'zod';

type ExtensionRequest = {
  enabled: boolean;
  id: string;
  profile_id: string;
};

const validationSchema = object({
  enabled: boolean(),
  id: string(),
  profile_id: string()
});

export const post: Handler = async (req, res) => {
  const { body } = req;

  if (!body) {
    return noBody(res);
  }

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return invalidBody(res);
  }

  if (!(await validateIsStaff(req))) {
    return notAllowed(res);
  }

  const { enabled, id, profile_id } = body as ExtensionRequest;

  try {
    if (enabled) {
      await heyPrisma.profileFeature.create({
        data: { featureId: id, profileId: profile_id }
      });
      logger.info(`Enabled features for ${profile_id}`);

      return res.status(200).json({ enabled, success: true });
    }

    await heyPrisma.profileFeature.delete({
      where: { profileId_featureId: { featureId: id, profileId: profile_id } }
    });
    logger.info(`Disabled features for ${profile_id}`);

    return res.status(200).json({ enabled, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
