import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from 'src/helpers/catchedError';
import validateIsStaff from 'src/helpers/middlewares/validateIsStaff';
import prisma from 'src/helpers/prisma';
import { invalidBody, noBody, notAllowed } from 'src/helpers/responses';
import { object, string } from 'zod';

type ExtensionRequest = {
  id: string;
};

const validationSchema = object({
  id: string()
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

  if (!(await validateIsStaff(req))) {
    return notAllowed(res);
  }

  const { id } = body as ExtensionRequest;

  try {
    await prisma.allowedToken.delete({ where: { id } });
    logger.info(`Deleted a token ${id}`);

    return res.status(200).json({ success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
