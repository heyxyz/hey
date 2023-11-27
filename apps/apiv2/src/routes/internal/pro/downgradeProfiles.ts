import { Errors } from '@hey/data/errors';
import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import prisma from '@utils/prisma';
import type { Handler } from 'express';
import { object, string } from 'zod';

type ExtensionRequest = {
  secret: string;
};

const validationSchema = object({
  secret: string()
});

export const post: Handler = async (req, res) => {
  const { body } = req;

  if (!body) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return res.status(400).json({ success: false, error: Errors.InvalidBody });
  }

  const { secret } = body as ExtensionRequest;

  if (secret !== process.env.SECRET) {
    return res
      .status(400)
      .json({ success: false, error: Errors.InvalidSecret });
  }

  try {
    await prisma.pro.deleteMany({
      where: { expiresAt: { lte: new Date().toISOString() } }
    });
    logger.info('Downgraded expired pro profiles');

    return res.status(200).json({ success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
