import type { Handler } from 'express';

import logger from '@hey/helpers/logger';
import catchedError from 'src/helpers/catchedError';
import validateIsStaff from 'src/helpers/middlewares/validateIsStaff';
import prisma from 'src/helpers/prisma';
import { notAllowed } from 'src/helpers/responses';

export const get: Handler = async (req, res) => {
  if (!(await validateIsStaff(req))) {
    return notAllowed(res);
  }

  try {
    const data = await prisma.feature.findMany({
      orderBy: { priority: 'desc' }
    });
    logger.info('All features fetched');

    return res.status(200).json({ features: data, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
