import { getRedis, setRedis } from "@hey/db/redisClient";
import logger from "@hey/helpers/logger";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { CACHE_AGE_1_MINUTE } from "src/helpers/constants";
import getRates from "src/helpers/lens/getRates";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";

export const get = [
  rateLimiter({ requests: 250, within: 1 }),
  async (_: Request, res: Response) => {
    try {
      const cacheKey = "rates";
      const cachedData = await getRedis(cacheKey);

      if (cachedData) {
        logger.info("(cached) [Lens] Fetched USD conversion rates");
        return res
          .status(200)
          .setHeader("Cache-Control", CACHE_AGE_1_MINUTE)
          .json({ result: JSON.parse(cachedData), success: true });
      }

      const result = await getRates();
      await setRedis(cacheKey, result, 300);
      logger.info("[Lens] Fetched USD conversion rates");

      return res
        .status(200)
        .setHeader("Cache-Control", CACHE_AGE_1_MINUTE)
        .json({ result, success: true });
    } catch (error) {
      catchedError(res, error);
    }
  }
];
