import lensPg from "@hey/db/lensPg";
import prisma from "@hey/db/prisma/db/client";
import { getRedis, setRedis } from "@hey/db/redisClient";
import logger from "@hey/helpers/logger";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";
import { noBody } from "src/helpers/responses";

export const get = [
  rateLimiter({ requests: 500, within: 1 }),
  async (req: Request, res: Response) => {
    const { id } = req.query;

    if (!id) {
      return noBody(res);
    }

    try {
      const cacheKey = `list:profiles:${id}`;
      const cachedData = await getRedis(cacheKey);

      if (cachedData) {
        logger.info(`(cached) List profiles fetched for ${id}`);
        return res
          .status(200)
          .json({ result: JSON.parse(cachedData), success: true });
      }

      const data = await prisma.listProfile.findMany({
        where: { listId: id as string }
      });

      const profiles = data.map((item) => item.profileId);
      const profilesList = profiles.map((p) => `'${p}'`).join(",");

      const result = await lensPg.query(
        `
          SELECT profile_id
          FROM profile.record
          WHERE profile_id IN (${profilesList})
          AND is_burnt = false
          LIMIT 50
        `
      );

      const filteredProfiles = result.map((item) => item.profile_id);
      await setRedis(cacheKey, JSON.stringify(filteredProfiles));
      logger.info(`Lists profiles fetched for ${id}`);

      return res.status(200).json({ result: filteredProfiles, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
