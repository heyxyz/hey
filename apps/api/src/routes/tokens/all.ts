import type { Request, Response } from "express";

import prisma from "@hey/db/prisma/db/client";
import { getRedis, setRedis } from "@hey/db/redisClient";
import logger from "@hey/helpers/logger";
import catchedError from "src/helpers/catchedError";
import { CACHE_AGE_1_DAY } from "src/helpers/constants";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";

export const get = [
  rateLimiter({ requests: 250, within: 1 }),
  async (_: Request, res: Response) => {
    try {
      const cacheKey = "allowed-tokens";
      const cachedData = await getRedis(cacheKey);

      if (cachedData) {
        logger.info("(cached) All tokens fetched");
        return res
          .status(200)
          .setHeader("Cache-Control", CACHE_AGE_1_DAY)
          .json({ success: true, tokens: JSON.parse(cachedData) });
      }

      const data = await prisma.allowedToken.findMany({
        orderBy: { priority: "desc" }
      });

      await setRedis(cacheKey, data);
      logger.info("All tokens fetched");

      return res
        .status(200)
        .setHeader("Cache-Control", CACHE_AGE_1_DAY)
        .json({ success: true, tokens: data });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
