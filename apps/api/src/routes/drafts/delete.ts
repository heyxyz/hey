import type { Handler } from 'express';

import logger from '@hey/helpers/logger';
import catchedError from 'src/helpers/catchedError';
import validateLensAccount from 'src/helpers/middlewares/validateLensAccount';
import prisma from 'src/helpers/prisma';
import { invalidBody, noBody, notAllowed } from 'src/helpers/responses';
import { object, string } from 'zod';

type ExtensionRequest = {
  id: string;
};

const validationSchema = object({
  id: string()
});

// TODO: add tests
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

  const { id } = body as ExtensionRequest;

  try {
    const result = await prisma.draftPublication.delete({
      where: { id: id as string }
    });

    logger.info(`Draft publication deleted for ${id}`);

    return res.status(200).json({ result, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
