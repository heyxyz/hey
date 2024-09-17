import type { Handler } from "express";

import lensPg from "@hey/db/lensPg";
import logger from "@hey/helpers/logger";
import catchedError from "src/helpers/catchedError";
import { CACHE_AGE_30_MINS } from "src/helpers/constants";
import { noBody } from "src/helpers/responses";

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  try {
    const [globalStats, notificationStats] = await lensPg.multi(
      `
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
        FROM global_stats.profile
        WHERE profile_id = $1;
        SELECT COUNT(*) as total_notifications
        FROM notification.record
        WHERE notification_receiving_profile_id = $1;
      `,
      [id]
    );

    if (!globalStats[0]) {
      return res.status(404).json({ success: false });
    }

    const result = {
      ...globalStats[0],
      total_notifications: Number(notificationStats[0]?.total_notifications)
    };

    logger.info(`[Lens] Fetched global profile stats for ${id}`);

    return res
      .status(200)
      .setHeader("Cache-Control", CACHE_AGE_30_MINS)
      .json({ result, success: true });
  } catch (error) {
    catchedError(res, error);
  }
};
