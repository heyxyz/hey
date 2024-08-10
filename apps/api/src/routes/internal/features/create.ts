import type { Request, Response } from 'express';

import logger from '@hey/helpers/logger';
import catchedError from 'src/helpers/catchedError';
import validateIsStaff from 'src/helpers/middlewares/validateIsStaff';
import validateLensAccount from 'src/helpers/middlewares/validateLensAccount';
import prisma from 'src/helpers/prisma';
import { invalidBody, noBody } from 'src/helpers/responses';
import { object, string } from 'zod';

type ExtensionRequest = {
  key: string;
};

const validationSchema = object({
  key: string()
});

export const post = [
  validateLensAccount,
  validateIsStaff,
  async (req: Request, res: Response) => {
    const { body } = req;

    if (!body) {
      return noBody(res);
    }

    const validation = validationSchema.safeParse(body);

    if (!validation.success) {
      return invalidBody(res);
    }

    const { key } = body as ExtensionRequest;

    try {
      const feature = await prisma.feature.create({
        data: { key, priority: 1000 }
      });

      logger.info(`Created a feature flag ${feature.id}`);

      return res.status(200).json({ feature, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
