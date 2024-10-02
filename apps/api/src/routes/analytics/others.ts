import lensPg from "@hey/db/lensPg";
import logger from "@hey/helpers/logger";
import parseJwt from "@hey/helpers/parseJwt";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { CACHE_AGE_30_MINS } from "src/helpers/constants";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";
import validateIsPro from "src/helpers/middlewares/validateIsPro";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";

export const get = [
  rateLimiter({ requests: 250, within: 1 }),
  validateLensAccount,
  validateIsPro,
  async (req: Request, res: Response) => {
    try {
      const identityToken = req.headers["x-identity-token"] as string;
      const payload = parseJwt(identityToken);

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
        [payload.id]
      );

      if (!globalStats[0]) {
        return res.status(404).json({ success: false });
      }

      const result = {
        ...globalStats[0],
        total_notifications: Number(notificationStats[0]?.total_notifications)
      };

      logger.info(`Other analytics stats fetched for ${payload.id}`);

      return res
        .status(200)
        .setHeader("Cache-Control", CACHE_AGE_30_MINS)
        .json({ result, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
