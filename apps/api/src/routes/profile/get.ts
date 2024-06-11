import type { ProfileDetails } from '@good/types/good';
import type { Handler } from 'express';

import logger from '@good/helpers/logger';
import goodPg from 'src/db/goodPg';
import catchedError from 'src/helpers/catchedError';
import { SUSPENDED_FEATURE_ID } from 'src/helpers/constants';
import { noBody } from 'src/helpers/responses';

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  try {
    const [profileFeature, pinnedPublication] = await goodPg.multi(
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

    logger.info(`Profile details fetched for ${id}`);

    return res.status(200).json({ result: response, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
