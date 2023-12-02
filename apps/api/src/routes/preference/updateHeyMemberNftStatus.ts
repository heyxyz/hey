import logger from '@hey/lib/logger';
import parseJwt from '@hey/lib/parseJwt';
import catchedError from '@utils/catchedError';
import validateLensAccount from '@utils/middlewares/validateLensAccount';
import prisma from '@utils/prisma';
import { notAllowed } from '@utils/responses';
import type { Handler } from 'express';

export const post: Handler = async (req, res) => {
  const accessToken = req.headers['x-access-token'] as string;

  if (!(await validateLensAccount(req))) {
    return notAllowed(res);
  }

  try {
    const payload = parseJwt(accessToken);

    const data = await prisma.membershipNft.upsert({
      where: { id: payload.id },
      update: { dismissedOrMinted: true },
      create: { id: payload.id, dismissedOrMinted: true }
    });
    logger.info(`Updated membership nft status for ${payload.id}`);

    return res.status(200).json({ success: true, result: data });
  } catch (error) {
    return catchedError(res, error);
  }
};
