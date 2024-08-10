import type { Request, Response } from 'express';

import leafwatch from '@hey/db/prisma/leafwatch/client';
import logger from '@hey/helpers/logger';
import catchedError from 'src/helpers/catchedError';
import validateIsStaff from 'src/helpers/middlewares/validateIsStaff';
import validateLensAccount from 'src/helpers/middlewares/validateLensAccount';

export const get = [
  validateLensAccount,
  validateIsStaff,
  async (_: Request, res: Response) => {
    try {
      const [lastHour, today, yesterday, thisWeek, thisMonth, allTime] =
        await leafwatch.$transaction([
          leafwatch.impression.count({
            where: { viewed: { gte: new Date(Date.now() - 3600000) } }
          }),
          leafwatch.impression.count({
            where: { viewed: { equals: new Date() } }
          }),
          leafwatch.impression.count({
            where: { viewed: { gte: new Date(Date.now() - 86400000) } }
          }),
          leafwatch.impression.count({
            where: { viewed: { gte: new Date(Date.now() - 604800000) } }
          }),
          leafwatch.impression.count({
            where: { viewed: { gte: new Date(Date.now() - 2592000000) } }
          }),
          leafwatch.impression.count()
        ]);

      logger.info('Fetched Leafwatch impressions stats');

      return res.status(200).json({
        allTime,
        lastHour,
        success: true,
        thisMonth,
        thisWeek,
        today,
        yesterday
      });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
