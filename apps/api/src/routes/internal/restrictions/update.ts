import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import validateIsStaff from '@utils/middlewares/validateIsStaff';
import prisma from '@utils/prisma';
import { invalidBody, noBody, notAllowed } from '@utils/responses';
import { boolean, object, string } from 'zod';

type ExtensionRequest = {
  id: string;
  isFlagged: boolean;
  isSuspended: boolean;
};

const validationSchema = object({
  id: string(),
  isFlagged: boolean(),
  isSuspended: boolean()
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

  const { id, isFlagged, isSuspended } = body as ExtensionRequest;

  try {
    const restrictions = await prisma.profileRestriction.upsert({
      create: { id, isFlagged, isSuspended, updatedAt: new Date() },
      update: { isFlagged, isSuspended, updatedAt: new Date() },
      where: { id: id }
    });
    logger.info(`Disabled pro for ${id}`);

    return res.status(200).json({ restrictions, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
