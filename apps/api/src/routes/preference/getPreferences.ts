import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import { SWR_CACHE_AGE_1_MIN_30_DAYS } from '@utils/constants';
import validateIsOwnerOrStaff from '@utils/middlewares/validateIsOwnerOrStaff';
import prisma from '@utils/prisma';
import { noBody, notAllowed } from '@utils/responses';

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  if (!(await validateIsOwnerOrStaff(req, id as string))) {
    return notAllowed(res);
  }

  try {
    const [preference, pro, features, membershipNft] =
      await prisma.$transaction([
        prisma.preference.findUnique({ where: { id: id as string } }),
        prisma.pro.findFirst({ where: { profileId: id as string } }),
        prisma.profileFeature.findMany({
          select: { feature: { select: { key: true } } },
          where: {
            enabled: true,
            feature: { enabled: true },
            profileId: id as string
          }
        }),
        prisma.membershipNft.findUnique({ where: { id: id as string } })
      ]);

    const response = {
      features: features.map((feature: any) => feature.feature?.key),
      membershipNft: {
        dismissedOrMinted: Boolean(membershipNft?.dismissedOrMinted)
      },
      preference,
      pro: { enabled: Boolean(pro) }
    };

    logger.info('Profile preferences fetched');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_1_MIN_30_DAYS)
      .json({
        result: response,
        success: true
      });
  } catch (error) {
    return catchedError(res, error);
  }
};
