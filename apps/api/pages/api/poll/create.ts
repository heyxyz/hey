import { Errors } from '@hey/data/errors';
import logger from '@hey/lib/logger';
import allowCors from '@utils/allowCors';
import catchedError from '@utils/catchedError';
import validateLensAccount from '@utils/middlewares/validateLensAccount';
import prisma from '@utils/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { array, number, object, string } from 'zod';

type ExtensionRequest = {
  options: string[];
  length: number;
};

const validationSchema = object({
  options: array(string()),
  length: number()
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;

  if (!body) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return res.status(400).json({ success: false, error: Errors.InvalidBody });
  }

  if (!(await validateLensAccount(req))) {
    return res
      .status(400)
      .json({ success: false, error: Errors.InvalidAccesstoken });
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
        endedAt: new Date(Date.now() + length * 24 * 60 * 60 * 1000)
      }
    });

    logger.info(`Created a poll ${data.id}`);

    return res.status(200).json({ success: true, id: data.id });
  } catch (error) {
    return catchedError(res, error);
  }
};

export default allowCors(handler);
