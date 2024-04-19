import type { Preferences } from '@hey/types/hey';
import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import heyPrisma from 'src/lib/heyPrisma';
import validateIsOwnerOrStaff from 'src/lib/middlewares/validateIsOwnerOrStaff';
import { noBody, notAllowed } from 'src/lib/responses';

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  if (!(await validateIsOwnerOrStaff(req, id as string))) {
    return notAllowed(res);
  }

  try {
    const [preference, features, email, membershipNft] =
      await heyPrisma.$transaction([
        heyPrisma.preference.findUnique({ where: { id: id as string } }),
        heyPrisma.profileFeature.findMany({
          select: { feature: { select: { key: true } } },
          where: {
            enabled: true,
            feature: { enabled: true },
            profileId: id as string
          }
        }),
        heyPrisma.email.findUnique({ where: { id: id as string } }),
        heyPrisma.membershipNft.findUnique({ where: { id: id as string } })
      ]);

    const response: Preferences = {
      appIcon: preference?.appIcon || 0,
      email: email?.email || null,
      emailVerified: Boolean(email?.verified),
      features: features.map((feature: any) => feature.feature?.key),
      hasDismissedOrMintedMembershipNft: Boolean(
        membershipNft?.dismissedOrMinted
      ),
      highSignalNotificationFilter: Boolean(
        preference?.highSignalNotificationFilter
      )
    };

    logger.info('Profile preferences fetched');

    return res.status(200).json({ result: response, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
