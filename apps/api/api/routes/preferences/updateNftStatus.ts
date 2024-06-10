import type { Handler } from 'express';

import logger from '@good/helpers/logger';
import parseJwt from '@good/helpers/parseJwt';
import catchedError from 'api/helpers/catchedError';
import validateLensAccount from 'api/helpers/middlewares/validateLensAccount';
import prisma from 'api/helpers/prisma';
import { notAllowed } from 'api/helpers/responses';

export const post: Handler = async (req, res) => {
  const accessToken = req.headers['x-access-token'] as string;

  const validateLensAccountStatus = await validateLensAccount(req);
  if (validateLensAccountStatus !== 200) {
    return notAllowed(res, validateLensAccountStatus);
  }

  try {
    const payload = parseJwt(accessToken);

    const data = await prisma.membershipNft.upsert({
      create: { dismissedOrMinted: true, id: payload.id },
      update: { dismissedOrMinted: true },
      where: { id: payload.id }
    });
    logger.info(`Updated membership nft status for ${payload.id}`);

    return res.status(200).json({ result: data, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
