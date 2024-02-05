import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import validateIsStaff from 'src/lib/middlewares/validateIsStaff';
import prisma from 'src/lib/prisma';
import { notAllowed } from 'src/lib/responses';

export const get: Handler = async (req, res) => {
  if (!(await validateIsStaff(req))) {
    return notAllowed(res);
  }

  try {
    const data = await prisma.feature.findMany({
      orderBy: { createdAt: 'desc' },
      where: { type: 'KILL_SWITCH' }
    });
    logger.info('All switches fetched');

    return res.status(200).json({ success: true, switches: data });
  } catch (error) {
    return catchedError(res, error);
  }
};
