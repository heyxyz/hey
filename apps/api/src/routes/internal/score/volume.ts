import type { Handler } from 'express';

import heyPg from 'src/db/heyPg';
import catchedError from 'src/helpers/catchedError';

// TODO: add tests
export const get: Handler = async (req, res) => {
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
      cached: score[0].total_score,
      success: true,
      volume: score[0].total_count
    });
  } catch (error) {
    catchedError(res, error);
  }
};
