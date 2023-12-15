import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import parseJwt from '@hey/lib/parseJwt';
import catchedError from '@utils/catchedError';
import validateLensAccount from '@utils/middlewares/validateLensAccount';
import prisma from '@utils/prisma';
import { notAllowed } from '@utils/responses';

export const get: Handler = async (req, res) => {
  const accessToken = req.headers['x-access-token'] as string;

  if (!(await validateLensAccount(req))) {
    return notAllowed(res);
  }

  try {
    const payload = parseJwt(accessToken);
    const profile = payload.id;

    const conversations = await prisma.conversation.findMany({
      include: { messages: { orderBy: { createdAt: 'desc' }, take: 1 } },
      orderBy: { updatedAt: 'desc' },
      where: {
        OR: [{ sender: profile }, { recipient: profile }]
      }
    });

    logger.info(`Retrieved all conversations for ${profile}`);

    return res.status(200).json({ conversations, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
