import type { Handler } from 'express';

import logger from '@good/helpers/logger';
import parseJwt from '@good/helpers/parseJwt';
import catchedError from 'src/helpers/catchedError';
import validateLensAccount from 'src/helpers/middlewares/validateLensAccount';
import prisma from 'src/helpers/prisma';
import { notAllowed } from 'src/helpers/responses';

export const post: Handler = async (req, res) => {
  const validateLensAccountStatus = await validateLensAccount(req);
  if (validateLensAccountStatus !== 200) {
    return notAllowed(res, validateLensAccountStatus);
  }

  try {
    const identityToken = req.headers['x-identity-token'] as string;
    const payload = parseJwt(identityToken);

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
