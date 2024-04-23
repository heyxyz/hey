import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import { CACHE_AGE_1_DAY } from 'src/lib/constants';
import lensPrisma from 'src/lib/lensPrisma';
import { noBody } from 'src/lib/responses';

// TODO: add tests
export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  try {
    const scores = await lensPrisma.$queryRaw<{ score: number }[]>`
      SELECT profile_id, SUM(score) AS score
      FROM (
        -- Scores from notifications
        SELECT 
          notification_receiving_profile_id AS profile_id,
          SUM(
            CASE 
              WHEN notification_type = 'REACTED' THEN 1
              WHEN notification_type = 'COMMENTED' THEN 2
              WHEN notification_type = 'MENTIONED' THEN 3
              WHEN notification_type = 'MIRRORED' THEN 4
              WHEN notification_type = 'ACTED' THEN 4
              WHEN notification_type = 'FOLLOWED' THEN 5
              WHEN notification_type = 'QUOTED' THEN 5
              ELSE 0
            END
          ) AS score
        FROM notification.record
        WHERE notification_receiving_profile_id = ${id}
        GROUP BY notification_receiving_profile_id
        UNION ALL

        -- Positive scores from bookmarks
        SELECT 
          ${id} AS profile_id,
          2 * COUNT(DISTINCT publication_id) AS score
        FROM 
          (
            SELECT publication_id, profile_id
            FROM personalisation.bookmarked_publication
            WHERE split_part(publication_id, '-', 1) = ${id}
          ) AS bookmarks
        UNION ALL

        -- Negative scores from not interested
        SELECT
          ${id} AS profile_id,
          -1 * COUNT(DISTINCT publication_id) AS score
        FROM (
          SELECT publication_id, actioned_by_profile_id
          FROM personalisation.not_interested_publication
          WHERE split_part(publication_id, '-', 1) = ${id}
        ) AS not_interested
        UNION ALL

        -- Negative scores from blocked
        SELECT
          ${id} AS profile_id,
          -5 * COUNT(DISTINCT blocking_profile_id) AS score
        FROM (
          SELECT blocking_profile_id
          FROM profile.blocked
          WHERE blocking_profile_id = ${id}
        ) AS blocked
      ) AS scores
      GROUP BY profile_id
    `;

    if (!scores[0]) {
      return res.status(404).json({ success: false });
    }

    const score = Number(scores[0].score);

    logger.info(`Lens: Fetched profile score for ${id} - ${score}`);

    return res
      .status(200)
      .setHeader('Cache-Control', CACHE_AGE_1_DAY)
      .json({ cached: new Date().toISOString(), score, success: true });
  } catch (error) {
    catchedError(res, error);
  }
};
