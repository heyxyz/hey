import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import { SWR_CACHE_AGE_1_MIN_30_DAYS } from '@utils/constants';
import prisma from '@utils/prisma';
import { noBody } from '@utils/responses';

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  try {
    const data = await prisma.membershipNft.findUnique({
      where: { id: id as string }
    });
    logger.info('Membership NFT status fetched');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_1_MIN_30_DAYS)
      .json({
        result: { dismissedOrMinted: data?.dismissedOrMinted ? true : false },
        success: true
      });
  } catch (error) {
    return catchedError(res, error);
  }
};
