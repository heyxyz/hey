import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import parseJwt from '@hey/lib/parseJwt';
import catchedError from 'src/lib/catchedError';
import heyPrisma from 'src/lib/heyPrisma';
import validateLensAccount from 'src/lib/middlewares/validateLensAccount';
import { notAllowed } from 'src/lib/responses';

export const post: Handler = async (req, res) => {
  const accessToken = req.headers['x-access-token'] as string;

  if (!(await validateLensAccount(req))) {
    return notAllowed(res);
  }

  try {
    const payload = parseJwt(accessToken);

    const data = await heyPrisma.membershipNft.upsert({
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
