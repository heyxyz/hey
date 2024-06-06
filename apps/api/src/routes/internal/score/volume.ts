import type { Handler } from 'express';

import heyPg from 'src/db/heyPg';
import catchedError from 'src/helpers/catchedError';
import validateIsStaff from 'src/helpers/middlewares/validateIsStaff';
import { notAllowed } from 'src/helpers/responses';

// TODO: add tests
export const get: Handler = async (req, res) => {
  const validateIsStaffStatus = await validateIsStaff(req);
  if (validateIsStaffStatus !== 200) {
    return notAllowed(res, validateIsStaffStatus);
  }

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
};
