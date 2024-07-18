import type { Request, Response } from 'express';

import heyPg from '@hey/db/heyPg';
import logger from '@hey/helpers/logger';
import parseJwt from '@hey/helpers/parseJwt';
import catchedError from 'src/helpers/catchedError';
import { STAFF_MODE_FEATURE_ID } from 'src/helpers/constants';
import validateIsStaff from 'src/helpers/middlewares/validateIsStaff';
import validateLensAccount from 'src/helpers/middlewares/validateLensAccount';
import { invalidBody, noBody } from 'src/helpers/responses';
import { boolean, object } from 'zod';

type ExtensionRequest = {
  enabled: boolean;
};

const validationSchema = object({
  enabled: boolean()
});

export const post = [
  validateLensAccount,
  validateIsStaff,
  async (req: Request, res: Response) => {
    const { body } = req;

    if (!body) {
      return noBody(res);
    }

    const validation = validationSchema.safeParse(body);

    if (!validation.success) {
      return invalidBody(res);
    }

    const { enabled } = body as ExtensionRequest;

    try {
      const identityToken = req.headers['x-identity-token'] as string;
      const payload = parseJwt(identityToken);
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
  }
];
