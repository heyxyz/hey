import type { Handler } from 'express';

import { Errors } from '@hey/data/errors';
import logger from '@hey/lib/logger';
import catchedError from 'src/helpers/catchedError';
import prisma from 'src/helpers/prisma';
import { invalidBody, noBody } from 'src/helpers/responses';
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
    return noBody(res);
  }

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return invalidBody(res);
  }

  const { secret } = body as ExtensionRequest;

  if (secret !== process.env.SECRET) {
    return res
      .status(400)
      .json({ error: Errors.InvalidSecret, success: false });
  }

  try {
    // Cleanup Draft Publications that are older than 30 days
    const { count } = await prisma.draftPublication.deleteMany({
      where: {
        updatedAt: { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }
    });
    logger.info(
      `Cleaned up ${count} draft publications that are older than 30 days`
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
