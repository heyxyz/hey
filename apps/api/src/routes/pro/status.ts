import type { Handler } from 'express';

import { Stripe } from '@hey/data/constants';
import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import { CACHE_AGE_INDEFINITE } from '@utils/constants';
import prisma from '@utils/prisma';
import { noBody } from '@utils/responses';

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  try {
    const pro = await prisma.pro.findFirst({
      where: { profileId: id as string }
    });

    const result = {
      isBeliever: pro?.plan === Stripe.BELIEVER,
      isPro: pro?.plan === Stripe.PRO
    };

    logger.info(`Pro status fetched: ${id}`);

    return res
      .status(200)
      .setHeader('Cache-Control', CACHE_AGE_INDEFINITE)
      .json({ result, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
