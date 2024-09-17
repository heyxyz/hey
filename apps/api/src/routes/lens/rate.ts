import type { Request, Response } from "express";

import lensPg from "@hey/db/lensPg";
import { getRedis, setRedis } from "@hey/db/redisClient";
import logger from "@hey/helpers/logger";
import catchedError from "src/helpers/catchedError";
import { CACHE_AGE_30_MINS } from "src/helpers/constants";
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
          .setHeader("Cache-Control", CACHE_AGE_30_MINS)
          .json({ result: JSON.parse(cachedData), success: true });
      }

      const response = await lensPg.query(`
        SELECT ec.name AS name,
          ec.symbol AS symbol,
          ec.decimals AS decimals,
          ec.currency AS address,
          fc.price AS fiat
        FROM fiat.conversion AS fc
        JOIN enabled.currency AS ec ON fc.currency = ec.currency
        WHERE fc.fiatsymbol = 'usd';
      `);

      const result = response.map((row: any) => ({
        address: row.address.toLowerCase(),
        decimals: row.decimals,
        fiat: Number(row.fiat),
        name: row.name,
        symbol: row.symbol
      }));

      await setRedis(cacheKey, result);
      logger.info("[Lens] Fetched USD conversion rates");

      return res
        .status(200)
        .setHeader("Cache-Control", CACHE_AGE_30_MINS)
        .json({ result, success: true });
    } catch (error) {
      catchedError(res, error);
    }
  }
];
