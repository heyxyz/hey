import type { ProfileDetails } from '@hey/types/hey';
import type { Request, Response } from 'express';

import heyPg from '@hey/db/heyPg';
import { getRedis, setRedis } from '@hey/db/redisClient';
import logger from '@hey/helpers/logger';
import catchedError from 'src/helpers/catchedError';
import { SUSPENDED_FEATURE_ID } from 'src/helpers/constants';
import { rateLimiter } from 'src/helpers/middlewares/rateLimiter';
import { noBody } from 'src/helpers/responses';

export const get = [
  rateLimiter({ requests: 250, within: 1 }),
  async (req: Request, res: Response) => {
    const { id } = req.query;

    if (!id) {
      return noBody(res);
    }

    try {
      const cacheKey = `profile:${id}`;
      const cachedData = await getRedis(cacheKey);

      if (cachedData) {
        logger.info(`(cached) Profile details fetched for ${id}`);
        return res
          .status(200)
          .json({ result: JSON.parse(cachedData), success: true });
      }

      const [profileFeature, pinnedPublication] = await heyPg.multi(
        `
        SELECT * FROM "ProfileFeature"
        WHERE enabled = TRUE
        AND "featureId" = $2 AND "profileId" = $1;
        SELECT "publicationId" FROM "PinnedPublication" WHERE id = $1;
      `,
        [id as string, SUSPENDED_FEATURE_ID]
      );

      const response: ProfileDetails = {
        isSuspended: profileFeature[0]?.featureId === SUSPENDED_FEATURE_ID,
        pinnedPublication: pinnedPublication[0]?.publicationId || null
      };

      await setRedis(cacheKey, response);
      logger.info(`Profile details fetched for ${id}`);

      return res.status(200).json({ result: response, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
