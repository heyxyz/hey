import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import heyPrisma from 'src/lib/heyPrisma';
import validateIsStaff from 'src/lib/middlewares/validateIsStaff';
import { notAllowed } from 'src/lib/responses';

export const get: Handler = async (req, res) => {
  if (!(await validateIsStaff(req))) {
    return notAllowed(res);
  }

  try {
    const data = await heyPrisma.feature.findMany({
      orderBy: { priority: 'desc' }
    });
    logger.info('All features fetched');

    return res.status(200).json({ features: data, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
