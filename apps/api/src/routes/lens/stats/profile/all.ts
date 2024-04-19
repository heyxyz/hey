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
    const response = await lensPrisma.$queryRaw<any>`
      SELECT 
        total_posts,
        total_comments,
        total_mirrors,
        total_quotes,
        total_publications,
        total_reacted,
        total_reactions,
        total_collects,
        total_acted
      FROM
        global_stats.profile
      WHERE 
        profile_id = ${id};
    `;

    if (!response[0]) {
      return res.status(404).json({ success: false });
    }

    const result = response[0];

    logger.info(`Lens: Profile likes stats fetched for ${id}`);

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_10_MINS_30_DAYS)
      .json({ result, success: true });
  } catch (error) {
    catchedError(res, error);
  }
};
