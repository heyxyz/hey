import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import validateIsStaff from '@utils/middlewares/validateIsStaff';
import prisma from '@utils/prisma';
import { invalidBody, noBody, notAllowed } from '@utils/responses';
import type { Handler } from 'express';
import { boolean, object, string } from 'zod';

type ExtensionRequest = {
  id: string;
  enabled: boolean;
};

const validationSchema = object({
  id: string(),
  enabled: boolean()
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

  const { id, enabled } = body as ExtensionRequest;

  try {
    if (enabled) {
      await prisma.verified.create({ data: { id } });
      logger.info(`Enabled verified for ${id}`);

      return res.status(200).json({ success: true, enabled });
    }

    await prisma.verified.delete({ where: { id } });
    logger.info(`Disabled verified for ${id}`);

    return res.status(200).json({ success: true, enabled });
  } catch (error) {
    return catchedError(res, error);
  }
};
