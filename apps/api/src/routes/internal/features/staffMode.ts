import type { Handler } from 'express';

import logger from '@hey/helpers/logger';
import parseJwt from '@hey/helpers/parseJwt';
import heyPg from 'src/db/heyPg';
import catchedError from 'src/helpers/catchedError';
import { STAFF_MODE_FEATURE_ID } from 'src/helpers/constants';
import validateIsStaff from 'src/helpers/middlewares/validateIsStaff';
import { invalidBody, noBody, notAllowed } from 'src/helpers/responses';
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
      await heyPg.query(
        `
          INSERT INTO "ProfileFeature" ("profileId", "featureId")
          VALUES ($1, $2)
          ON CONFLICT ("profileId", "featureId") DO UPDATE
          SET enabled = true, "createdAt" = now()
        `,
        [profile_id, STAFF_MODE_FEATURE_ID]
      );

      logger.info(`Enabled staff mode for ${profile_id}`);

      return res.status(200).json({ enabled, success: true });
    }

    await heyPg.query(
      `
        DELETE FROM "ProfileFeature"
        WHERE "profileId" = $1 AND "featureId" = $2
      `,
      [profile_id, STAFF_MODE_FEATURE_ID]
    );

    logger.info(`Disabled staff mode for ${profile_id}`);

    return res.status(200).json({ enabled, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
