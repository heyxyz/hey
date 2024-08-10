import type { Request, Response } from 'express';

import logger from '@hey/helpers/logger';
import catchedError from 'src/helpers/catchedError';
import validateIsStaff from 'src/helpers/middlewares/validateIsStaff';
import validateLensAccount from 'src/helpers/middlewares/validateLensAccount';

export const get = [
  validateLensAccount,
  validateIsStaff,
  (_: Request, res: Response) => {
    try {
      logger.info('Fetched Leafwatch stats');

      return res.status(200).json({
        dau: 'wip',
        events: 'wip',
        eventsToday: 'wip',
        impressions: 'wip',
        impressionsToday: 'wip',
        referrers: 'wip',
        success: true
      });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
