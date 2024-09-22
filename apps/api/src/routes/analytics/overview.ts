import lensPg from "@hey/db/lensPg";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { CACHE_AGE_30_MINS } from "src/helpers/constants";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";
import { noBody } from "src/helpers/responses";

export const get = [
  rateLimiter({ requests: 250, within: 1 }),
  async (req: Request, res: Response) => {
    const { id } = req.query;

    if (!id) {
      return noBody(res);
    }

    try {
      const result = await lensPg.multi(
        `
          SELECT DATE(action_at) AS date, COUNT(*) AS likes
          FROM publication.reaction
          WHERE type = 'UPVOTE'
            AND action_at >= NOW() - INTERVAL '30 days'
            AND SPLIT_PART(publication_id, '-', 1) = $1
          GROUP BY DATE(action_at)
          ORDER BY date;
        `,
        [id]
      );

      return res
        .status(200)
        .setHeader("Cache-Control", CACHE_AGE_30_MINS)
        .json({ result, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
