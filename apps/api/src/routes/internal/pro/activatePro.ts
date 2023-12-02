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
  trial: boolean;
};

const validationSchema = object({
  id: string(),
  enabled: boolean(),
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

  const { id, enabled, trial } = body as ExtensionRequest;

  try {
    if (enabled) {
      await prisma.pro.create({
        data: {
          profileId: id,
          hash: '0x00',
          expiresAt: '2100-01-01T00:00:00.000Z'
        }
      });
      logger.info(`Enabled pro for ${id}`);

      return res.status(200).json({ success: true, enabled, trial });
    }

    await prisma.pro.delete({ where: { profileId: id } });
    logger.info(`Disabled pro for ${id}`);

    return res.status(200).json({ success: true, enabled, trial });
  } catch (error) {
    return catchedError(res, error);
  }
};
