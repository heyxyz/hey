import type { Preferences } from '@hey/types/hey';
import type { Request, Response } from 'express';

import heyPg from '@hey/db/heyPg';
import { getRedis, setRedis } from '@hey/db/redisClient';
import logger from '@hey/helpers/logger';
import catchedError from 'src/helpers/catchedError';
import validateIsStaff from 'src/helpers/middlewares/validateIsStaff';
import validateLensAccount from 'src/helpers/middlewares/validateLensAccount';
import { noBody } from 'src/helpers/responses';

export const get = [
  validateLensAccount,
  validateIsStaff,
  async (req: Request, res: Response) => {
    const { id } = req.query;

    if (!id) {
      return noBody(res);
    }

    const cacheKey = `preference:${id}`;
    const cachedData = await getRedis(cacheKey);

    if (cachedData) {
      logger.info(`(cached) Internal profile preferences fetched for ${id}`);
      return res
        .status(200)
        .json({ result: JSON.parse(cachedData), success: true });
    }

    try {
      const [preference, features, email, membershipNft] = await heyPg.multi(
        `
        SELECT * FROM "Preference" WHERE id = $1;

        SELECT f.key
        FROM "ProfileFeature" AS pf
        JOIN "Feature" AS f ON pf."featureId" = f.id
        WHERE pf.enabled = TRUE
        AND f.enabled = TRUE
        AND pf."profileId" = $1;

        SELECT * FROM "Email" WHERE id = $1;

        SELECT * FROM "MembershipNft" WHERE id = $1;
      `,
        [id as string]
      );

      const response: Preferences = {
        appIcon: preference[0]?.appIcon || 0,
        email: email[0]?.email || null,
        emailVerified: Boolean(email[0]?.verified),
        features: features.map((feature: any) => feature?.key),
        hasDismissedOrMintedMembershipNft: Boolean(
          membershipNft[0]?.dismissedOrMinted
        ),
        highSignalNotificationFilter: Boolean(
          preference[0]?.highSignalNotificationFilter
        )
      };

      await setRedis(cacheKey, response);
      logger.info(`Internal profile preferences fetched for ${id}`);

      return res.status(200).json({ result: response, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
