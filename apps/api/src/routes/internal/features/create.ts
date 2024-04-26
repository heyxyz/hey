import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import validateIsStaff from 'src/lib/middlewares/validateIsStaff';
import prisma from 'src/lib/prisma';
import { invalidBody, noBody, notAllowed } from 'src/lib/responses';
import { object, string } from 'zod';

type ExtensionRequest = {
  key: string;
};

const validationSchema = object({
  key: string()
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

  const { key } = body as ExtensionRequest;

  try {
    const feature = await prisma.feature.create({ data: { key } });
    logger.info(`Created a feature flag ${feature.id}`);

    return res.status(200).json({ feature, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
