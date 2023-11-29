import { Errors } from '@hey/data/errors';
import logger from '@hey/lib/logger';
import parseJwt from '@hey/lib/parseJwt';
import catchedError from '@utils/catchedError';
import validateLensAccount from '@utils/middlewares/validateLensAccount';
import prisma from '@utils/prisma';
import type { Handler } from 'express';

export const post: Handler = async (req, res) => {
  const accessToken = req.headers['x-access-token'] as string;

  if (!(await validateLensAccount(req))) {
    return res
      .status(400)
      .json({ success: false, error: Errors.InvalidAccesstoken });
  }

  try {
    const payload = parseJwt(accessToken);

    const data = await prisma.membershipNft.upsert({
      where: { id: payload.evmAddress },
      update: { dismissedOrMinted: true },
      create: { id: payload.evmAddress, dismissedOrMinted: true }
    });
    logger.info(`Updated membership nft status for ${payload.evmAddress}`);

    return res.status(200).json({ success: true, result: data });
  } catch (error) {
    return catchedError(res, error);
  }
};
