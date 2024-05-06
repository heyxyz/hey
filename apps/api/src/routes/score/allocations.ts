import type { Handler } from 'express';

import logger from '@hey/helpers/logger';
import allocations from 'src/data/score-allocations';
import heyPg from 'src/db/heyPg';
import catchedError from 'src/helpers/catchedError';
import { noBody } from 'src/helpers/responses';

// TODO: add tests
export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  try {
    const adjustedProfileScore = await heyPg.query(
      `
        SELECT *
        FROM "AdjustedProfileScore"
        WHERE "profileId" = $1
        AND "reason" IN (${allocations.map((allocation) => `'${allocation.id}'`).join(',')});
      `,
      [id as string]
    );

    const result = adjustedProfileScore.map(({ reason, score }) => ({
      ...allocations.find((allocation) => allocation.id === reason),
      score
    }));

    logger.info(
      `Lens: Fetched ${adjustedProfileScore.length} allocations for ${id}`
    );

    return res.status(200).json({ result, success: true });
  } catch (error) {
    catchedError(res, error);
  }
};
