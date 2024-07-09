import type { Request, Response } from 'express';

import { APP_NAME } from '@hey/data/constants';
import logger from '@hey/helpers/logger';
import lensPg from 'src/db/lensPg';
import catchedError from 'src/helpers/catchedError';
import validateIsStaff from 'src/helpers/middlewares/validateIsStaff';
import validateLensAccount from 'src/helpers/middlewares/validateLensAccount';

// TODO: add tests
export const get = [
  validateLensAccount,
  validateIsStaff,
  async (_: Request, res: Response) => {
    try {
      const result = await lensPg.query(`
      SELECT 
        app,
        COUNT(publication_id) AS publications,
        SUM(total_amount_of_mirrors) AS mirrors,
        SUM(total_amount_of_comments) AS comments,
        SUM(total_amount_of_quotes) AS quotes,
        SUM(total_reactions) AS reactions,
        SUM(total_amount_of_collects) AS collects,
        SUM(total_amount_of_acted) AS actions,
        SUM(total_bookmarks) AS bookmarks
      FROM app_stats.publication
      WHERE app = '${APP_NAME.toLowerCase()}'
      GROUP BY app;
    `);

      logger.info('Lens: Fetched publication stats');

      return res.status(200).json({ result: result[0], success: true });
    } catch (error) {
      catchedError(res, error);
    }
  }
];
