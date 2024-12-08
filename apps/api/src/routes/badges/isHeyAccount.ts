import { HEY_LENS_SIGNUP } from "@hey/data/constants";
import lensPg from "@hey/db/lensPg";
import { getRedis, setRedis } from "@hey/db/redisClient";
import logger from "@hey/helpers/logger";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { CACHE_AGE_INDEFINITE } from "src/helpers/constants";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";
import { noBody } from "src/helpers/responses";

export const get = [
  rateLimiter({ requests: 100, within: 1 }),
  async (req: Request, res: Response) => {
    const { address } = req.query;

    if (!address) {
      return noBody(res);
    }

    try {
      const cacheKey = `badge:hey-account:${address}`;
      const cachedData = await getRedis(cacheKey);

      if (cachedData === "true") {
        logger.info(`(cached) Hey account badge fetched for ${address}`);

        return res
          .status(200)
          .setHeader("Cache-Control", CACHE_AGE_INDEFINITE)
          .json({ isHeyAccount: true, success: true });
      }

      const onboardingAccount = await lensPg.query(
        `
          SELECT EXISTS (
            SELECT 1
            FROM profile_view pv
            JOIN app.onboarding_profile o ON pv.profile_id = o.profile_id
            WHERE
              (pv.profile_id = $1 OR pv.owned_by = $2)
              AND o.onboarded_by_address = $3
          ) AS exists;
        `,
        [address, HEY_LENS_SIGNUP]
      );

      const isHeyAccount = onboardingAccount[0]?.exists;

      if (isHeyAccount) {
        await setRedis(cacheKey, isHeyAccount);
      }
      logger.info(`Hey account badge fetched for ${address}`);

      return res
        .status(200)
        .setHeader(
          "Cache-Control",
          isHeyAccount ? CACHE_AGE_INDEFINITE : "no-cache"
        )
        .json({ isHeyAccount, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
