import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import validateLensAccount from '@utils/middlewares/validateLensAccount';
import prisma from '@utils/prisma';
import { invalidBody, noBody, notAllowed } from '@utils/responses';
import type { Handler } from 'express';
import { array, number, object, string } from 'zod';

type ExtensionRequest = {
  options: string[];
  length: number;
};

const validationSchema = object({
  options: array(string()),
  length: number()
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

  if (!(await validateLensAccount(req))) {
    return notAllowed(res);
  }

  const { options, length } = body as ExtensionRequest;

  if (length < 1 || length > 30) {
    return res.status(400).json({
      success: false,
      error: 'Poll length should be between 1 and 30 days.'
    });
  }

  try {
    const data = await prisma.poll.create({
      data: {
        options: {
          createMany: {
            data: options.map((option) => ({ option })),
            skipDuplicates: true
          }
        },
        endsAt: new Date(Date.now() + length * 24 * 60 * 60 * 1000)
      }
    });

    logger.info(`Created a poll ${data.id}`);

    return res.status(200).json({ success: true, id: data.id });
  } catch (error) {
    return catchedError(res, error);
  }
};
