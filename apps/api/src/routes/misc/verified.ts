import { PermissionId } from "@hey/data/permissions";
import prisma from "@hey/db/prisma/db/client";
import { getRedis, setRedis } from "@hey/db/redisClient";
import logger from "@hey/helpers/logger";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { CACHE_AGE_30_MINS } from "src/helpers/constants";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";

export const get = [
  rateLimiter({ requests: 250, within: 1 }),
  async (_: Request, res: Response) => {
    try {
      const cacheKey = "verified";
      const cachedData = await getRedis(cacheKey);

      if (cachedData) {
        logger.info("(cached) Verified accounts fetched");
        return res
          .status(200)
          .setHeader("Cache-Control", CACHE_AGE_30_MINS)
          .json({ result: JSON.parse(cachedData), success: true });
      }

      const accountPermission = await prisma.accountPermission.findMany({
        select: { accountAddress: true },
        where: { enabled: true, permissionId: PermissionId.Verified }
      });

      const result = accountPermission.map(
        ({ accountAddress }) => accountAddress
      );
      await setRedis(cacheKey, result);
      logger.info("Verified accounts fetched");

      return res
        .status(200)
        .setHeader("Cache-Control", CACHE_AGE_30_MINS)
        .json({ result, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
