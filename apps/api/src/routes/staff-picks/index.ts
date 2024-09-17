import type { Request, Response } from "express";

import { STAFF_PICK_FEATURE_ID } from "@hey/db/constants";
import prisma from "@hey/db/prisma/db/client";
import { generateMediumExpiry, getRedis, setRedis } from "@hey/db/redisClient";
import logger from "@hey/helpers/logger";
import catchedError from "src/helpers/catchedError";
import { CACHE_AGE_30_MINS } from "src/helpers/constants";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";

const getRandomPicks = (data: any[]) => {
  const random = data.sort(() => Math.random() - Math.random());
  return random.slice(0, 150);
};

export const get = [
  rateLimiter({ requests: 100, within: 1 }),
  async (_: Request, res: Response) => {
    try {
      const cacheKey = "staff-picks";
      const cachedData = await getRedis(cacheKey);

      if (cachedData) {
        logger.info("(cached) Staff picks fetched");
        return res
          .status(200)
          .setHeader("Cache-Control", CACHE_AGE_30_MINS)
          .json({
            result: getRandomPicks(JSON.parse(cachedData)),
            success: true
          });
      }

      const data = await prisma.profilePermission.findMany({
        select: { profileId: true },
        where: { enabled: true, permissionId: STAFF_PICK_FEATURE_ID }
      });

      await setRedis(cacheKey, data, generateMediumExpiry());
      logger.info("Staff picks fetched");

      return res
        .status(200)
        .setHeader("Cache-Control", CACHE_AGE_30_MINS)
        .json({ result: getRandomPicks(data), success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
