import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import prisma from 'src/lib/prisma';

export const get: Handler = async (req, res) => {
  try {
    const data = await prisma.feature.findMany({
      select: { key: true },
      where: { enabled: true, type: 'KILL_SWITCH' }
    });

    logger.info('Kill switches fetched');

    return res.status(200).json({
      result: data.map(({ key }) => key),
      success: true
    });
  } catch (error) {
    return catchedError(res, error);
  }
};
