import type { Request, Response } from "express";

import prisma from "@hey/db/prisma/db/client";
import { generateMediumExpiry, getRedis, setRedis } from "@hey/db/redisClient";
import logger from "@hey/helpers/logger";
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
      const cacheKey = `pro:${id}`;
      const cachedData = await getRedis(cacheKey);

      if (cachedData) {
        logger.info(`(cached) Fetched pro status for ${id}`);

        return res
          .status(200)
          .setHeader("Cache-Control", CACHE_AGE_30_MINS)
          .json({ result: JSON.parse(cachedData), success: true });
      }

      const pro = await prisma.pro.findUnique({
        where: { id: id as string }
      });

      if (!pro) {
        return res
          .status(200)
          .json({ result: { expiresAt: null, isPro: false } });
      }

      const result = { expiresAt: pro.expiresAt, isPro: true };

      await setRedis(cacheKey, result, generateMediumExpiry());
      logger.info(`Fetched pro status for ${id}`);

      return res
        .status(200)
        .setHeader("Cache-Control", CACHE_AGE_30_MINS)
        .json({ result, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
