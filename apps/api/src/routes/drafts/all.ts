import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import parseJwt from '@hey/lib/parseJwt';
import catchedError from 'src/lib/catchedError';
import validateLensAccount from 'src/lib/middlewares/validateLensAccount';
import prisma from 'src/lib/prisma';
import { notAllowed } from 'src/lib/responses';

// TODO: add tests
export const get: Handler = async (req, res) => {
  const accessToken = req.headers['x-access-token'] as string;

  if (!(await validateLensAccount(req))) {
    return notAllowed(res);
  }

  try {
    const payload = parseJwt(accessToken);
    const result = await prisma.draftPublication.findMany({
      orderBy: { updatedAt: 'desc' },
      where: { profileId: payload.id }
    });

    logger.info(`Drafts fetched for ${payload.id}`);

    return res.status(200).json({ result, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
