import type { Request, Response } from 'express';

import prisma from '@hey/db/prisma/db/client';
import logger from '@hey/helpers/logger';
import catchedError from 'src/helpers/catchedError';
import validateIsStaff from 'src/helpers/middlewares/validateIsStaff';
import validateLensAccount from 'src/helpers/middlewares/validateLensAccount';

export const get = [
  validateLensAccount,
  validateIsStaff,
  async (_: Request, res: Response) => {
    try {
      const data = await prisma.feature.findMany({
        include: { _count: { select: { profiles: true } } },
        orderBy: { priority: 'asc' }
      });

      logger.info('All features fetched');

      return res.status(200).json({ features: data, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
