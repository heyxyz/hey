import { HEY_LENS_SIGNUP } from "@hey/data/constants";
import lensPg from "@hey/db/lensPg";
import { getRedis, setRedis } from "@hey/db/redisClient";
import logger from "@hey/helpers/logger";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { CACHE_AGE_INDEFINITE } from "src/helpers/constants";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";
import { noBody } from "src/helpers/responses";
import type { Address } from "viem";
import { getAddress } from "viem";

export const get = [
  rateLimiter({ requests: 100, within: 1 }),
  async (req: Request, res: Response) => {
    const { address, id } = req.query;

    if (!id && !address) {
      return noBody(res);
    }

    try {
      const formattedAddress = address
        ? getAddress(address as Address)
        : undefined;

      const cacheKey = `badge:hey-account:${id || address}`;
      const cachedData = await getRedis(cacheKey);

      if (cachedData === "true") {
        logger.info(
          `(cached) Hey account badge fetched for ${id || formattedAddress}`
        );

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
        [id, formattedAddress, HEY_LENS_SIGNUP]
      );

      const isHeyAccount = onboardingAccount[0]?.exists;

      if (isHeyAccount) {
        await setRedis(cacheKey, isHeyAccount);
      }
      logger.info(`Hey account badge fetched for ${id || formattedAddress}`);

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
