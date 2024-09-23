import clickhouseClient from "@hey/db/clickhouseClient";
import { generateLongExpiry, getRedis, setRedis } from "@hey/db/redisClient";
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

      const cacheKey = `analytics:impressions:${payload.id}`;
      const cachedData = await getRedis(cacheKey);

      if (cachedData) {
        logger.info(`(cached) Analytics impressions fetched for ${payload.id}`);
        return res
          .status(200)
          .setHeader("Cache-Control", CACHE_AGE_30_MINS)
          .json({ result: JSON.parse(cachedData), success: true });
      }

      const rows = await clickhouseClient.query({
        format: "JSONEachRow",
        query: `
          WITH
            arrayJoin(
              arrayMap(x -> toDate(now()) - x, range(30))
            ) AS date_range
          SELECT
            date_range AS date,
            countIf(toDate(viewed) = date_range) AS impressions
          FROM impressions
          WHERE substring(publication, 1, position(publication, '-') - 1) = '${payload.id}'
            AND viewed >= now() - INTERVAL 30 DAY
          GROUP BY date_range
          ORDER BY date_range;
        `
      });

      const result = await rows.json();

      await setRedis(cacheKey, JSON.stringify(result), generateLongExpiry());
      logger.info(`Analytics impressions fetched for ${payload.id}`);

      return res
        .status(200)
        .setHeader("Cache-Control", CACHE_AGE_30_MINS)
        .json({ result, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
