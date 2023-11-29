import { Errors } from '@hey/data/errors';
import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import { SWR_CACHE_AGE_1_MIN_30_DAYS } from '@utils/constants';
import validateIsOwnerOrStaff from '@utils/middlewares/validateIsOwnerOrStaff';
import prisma from '@utils/prisma';
import type { Handler } from 'express';

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  if (!(await validateIsOwnerOrStaff(req, id as string))) {
    return res.status(400).json({ success: false, error: Errors.NotAllowed });
  }

  try {
    const [preference, pro, features] = await prisma.$transaction([
      prisma.preference.findUnique({ where: { id: id as string } }),
      prisma.pro.findFirst({ where: { profileId: id as string } }),
      prisma.profileFeature.findMany({
        where: {
          profileId: id as string,
          enabled: true,
          feature: { enabled: true }
        },
        select: { feature: { select: { key: true } } }
      })
    ]);

    const response = {
      preference,
      pro: { enabled: Boolean(pro) },
      features: features.map((feature: any) => feature.feature?.key)
    };

    logger.info('Profile preferences fetched');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_1_MIN_30_DAYS)
      .json({
        success: true,
        result: response
      });
  } catch (error) {
    return catchedError(res, error);
  }
};
