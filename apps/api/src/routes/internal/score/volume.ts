import type { Request, Response } from 'express';

import heyPg from 'src/db/heyPg';
import catchedError from 'src/helpers/catchedError';
import validateIsStaff from 'src/helpers/middlewares/validateIsStaff';
import validateLensAccount from 'src/helpers/middlewares/validateLensAccount';

// TODO: add tests
export const get = [
  validateLensAccount,
  validateIsStaff,
  async (req: Request, res: Response) => {
    try {
      const score = await heyPg.query(
        `
        SELECT COUNT("score") AS total_count, SUM("score") AS total_score
        FROM "CachedProfileScore"
        WHERE "score" IS NOT NULL;      
      `,
        [req.query.id as string]
      );

      return res.status(200).json({
        cached: score[0].total_count,
        success: true,
        volume: score[0].total_score
      });
    } catch (error) {
      catchedError(res, error);
    }
  }
];
