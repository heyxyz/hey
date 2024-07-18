import type { Request, Response } from 'express';

import heyPg from '@hey/db/heyPg';
import logger from '@hey/helpers/logger';
import catchedError from 'src/helpers/catchedError';
import validateIsStaff from 'src/helpers/middlewares/validateIsStaff';
import validateLensAccount from 'src/helpers/middlewares/validateLensAccount';

export const get = [
  validateLensAccount,
  validateIsStaff,
  async (_: Request, res: Response) => {
    try {
      const data = await heyPg.query(`
      SELECT F.*, COUNT(PF."profileId") AS assigned
      FROM "Feature" F
      LEFT JOIN "ProfileFeature" PF ON F."id" = PF."featureId"
      GROUP BY F."id"
      ORDER BY F.priority ASC;
    `);

      logger.info('All features fetched');

      return res.status(200).json({ features: data, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
