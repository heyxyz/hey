import type { Preferences } from '@hey/types/hey';
import type { Handler } from 'express';

import logger from '@hey/helpers/logger';
import heyPg from 'src/db/heyPg';
import catchedError from 'src/helpers/catchedError';
import validateIsOwnerOrStaff from 'src/helpers/middlewares/validateIsOwnerOrStaff';
import { noBody, notAllowed } from 'src/helpers/responses';

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  if (!(await validateIsOwnerOrStaff(req, id as string))) {
    return notAllowed(res);
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

    logger.info('Profile preferences fetched');

    return res.status(200).json({ result: response, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
