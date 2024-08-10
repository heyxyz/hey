import type { Request, Response } from 'express';

import logger from '@hey/helpers/logger';
import catchedError from 'src/helpers/catchedError';
import validateIsStaff from 'src/helpers/middlewares/validateIsStaff';
import validateLensAccount from 'src/helpers/middlewares/validateLensAccount';
import { noBody } from 'src/helpers/responses';

export const get = [
  validateLensAccount,
  validateIsStaff,
  (req: Request, res: Response) => {
    const { id } = req.query;

    if (!id) {
      return noBody(res);
    }

    try {
      logger.info(`Profile impressions fetched for ${id}`);

      return res.status(200).json({
        success: true,
        totalImpressions: 'wip',
        yearlyImpressions: 'wip'
      });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
