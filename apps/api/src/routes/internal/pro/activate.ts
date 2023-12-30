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
  trial: boolean;
};

const validationSchema = object({
  enabled: boolean(),
  id: string(),
  trial: boolean()
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

  const { enabled, id, trial } = body as ExtensionRequest;

  try {
    if (enabled) {
      await prisma.pro.create({
        data: {
          expiresAt: '2100-01-01T00:00:00.000Z',
          hash: '0x00',
          profileId: id
        }
      });
      logger.info(`Enabled pro for ${id}`);

      return res.status(200).json({ enabled, success: true, trial });
    }

    await prisma.pro.delete({ where: { profileId: id } });
    logger.info(`Disabled pro for ${id}`);

    return res.status(200).json({ enabled, success: true, trial });
  } catch (error) {
    return catchedError(res, error);
  }
};
