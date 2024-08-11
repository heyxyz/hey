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
      const stats: [
        {
          allTime: bigint;
          lastHour: bigint;
          thisMonth: bigint;
          thisWeek: bigint;
          today: bigint;
          yesterday: bigint;
        }
      ] = await leafwatch.$queryRaw`
        SELECT
          COUNT(*) AS "allTime",
          COUNT(CASE WHEN viewed >= NOW() - INTERVAL '1 hour' THEN 1 END) AS "lastHour",
          COUNT(CASE WHEN DATE(viewed) = CURRENT_DATE THEN 1 END) AS "today",
          COUNT(CASE WHEN viewed >= DATE_TRUNC('day', NOW()) - INTERVAL '1 day' AND viewed < DATE_TRUNC('day', NOW()) THEN 1 END) AS "yesterday",
          COUNT(CASE WHEN viewed >= NOW() - INTERVAL '7 day' THEN 1 END) AS "thisWeek",
          COUNT(CASE WHEN viewed >= NOW() - INTERVAL '30 day' THEN 1 END) AS "thisMonth"
        FROM "Impression";
      `;

      // Convert BigInt values to Number
      const convertedStats = {
        allTime: Number(stats[0].allTime),
        lastHour: Number(stats[0].lastHour),
        thisMonth: Number(stats[0].thisMonth),
        thisWeek: Number(stats[0].thisWeek),
        today: Number(stats[0].today),
        yesterday: Number(stats[0].yesterday)
      };

      logger.info('Fetched Leafwatch impressions stats');

      return res.status(200).json(convertedStats);
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
