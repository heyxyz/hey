import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import { SWR_CACHE_AGE_10_MINS_30_DAYS } from 'src/lib/constants';
import lensPrisma from 'src/lib/lensPrisma';
import { noBody } from 'src/lib/responses';

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  try {
    const response = await lensPrisma.$queryRaw<
      { total_reacted: number; total_reactions: number }[]
    >`
      SELECT 
        a.profile_id, 
        COALESCE(a.total_reactions, 0) AS total_reactions,
        COALESCE(b.total_reacted, 0) AS total_reacted
      FROM 
        (SELECT profile_id, SUM(total) AS total_reactions
        FROM global_stats.profile_reaction
        WHERE profile_id = ${id}
        GROUP BY profile_id) AS a
      FULL OUTER JOIN 
        (SELECT profile_id, SUM(total) AS total_reacted
        FROM global_stats.profile_reacted
        WHERE profile_id = ${id}
        GROUP BY profile_id) AS b
      ON a.profile_id = b.profile_id;
    `;

    const result = {
      total_reacted: Number(response[0]?.total_reacted) || 0,
      total_reactions: Number(response[0]?.total_reactions) || 0
    };

    logger.info(`Lens: Profile likes stats fetched for ${id}`);

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_10_MINS_30_DAYS)
      .json({ result, success: true });
  } catch (error) {
    catchedError(res, error);
  }
};
