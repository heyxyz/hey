import { SUSPENDED_PERMISSION_ID } from "@hey/db/constants";
import prisma from "@hey/db/prisma/db/client";
import { getRedis, setRedis } from "@hey/db/redisClient";
import logger from "@hey/helpers/logger";
import type { ProfileDetails, ProfileTheme } from "@hey/types/hey";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
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
      const cacheKey = `profile:${id}`;
      const cachedData = await getRedis(cacheKey);

      if (cachedData) {
        logger.info(`(cached) Profile details fetched for ${id}`);
        return res
          .status(200)
          .json({ result: JSON.parse(cachedData), success: true });
      }

      const [profilePermission, proStatus, profileStatus, profileTheme] =
        await prisma.$transaction([
          prisma.profilePermission.findFirst({
            where: {
              permissionId: SUSPENDED_PERMISSION_ID,
              profileId: id as string
            }
          }),
          prisma.pro.findFirst({ where: { id: id as string } }),
          prisma.profileStatus.findFirst({ where: { id: id as string } }),
          prisma.profileTheme.findFirst({ where: { id: id as string } })
        ]);

      const isPro = proStatus?.id;
      const response: ProfileDetails = {
        isSuspended:
          profilePermission?.permissionId === SUSPENDED_PERMISSION_ID,
        status: isPro ? profileStatus || null : null,
        theme: isPro ? (profileTheme as ProfileTheme) || null : null
      };

      await setRedis(cacheKey, response);
      logger.info(`Profile details fetched for ${id}`);
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
