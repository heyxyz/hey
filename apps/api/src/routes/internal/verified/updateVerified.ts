import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import validateIsStaff from '@utils/middlewares/validateIsStaff';
import prisma from '@utils/prisma';
import { invalidBody, noBody, notAllowed } from '@utils/responses';
import { boolean, object, string } from 'zod';

type ExtensionRequest = {
  enabled: boolean;
  id: string;
};

const validationSchema = object({
  enabled: boolean(),
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

  const { enabled, id } = body as ExtensionRequest;

  try {
    if (enabled) {
      await prisma.verified.create({ data: { id } });
      logger.info(`Enabled verified for ${id}`);

      return res.status(200).json({ enabled, success: true });
    }

    await prisma.verified.delete({ where: { id } });
    logger.info(`Disabled verified for ${id}`);

    return res.status(200).json({ enabled, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
