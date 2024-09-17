import type { Preferences } from "@hey/types/hey";
import type { Request, Response } from "express";

import prisma from "@hey/db/prisma/db/client";
import { getRedis, setRedis } from "@hey/db/redisClient";
import logger from "@hey/helpers/logger";
import parseJwt from "@hey/helpers/parseJwt";
import catchedError from "src/helpers/catchedError";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";
import { noBody } from "src/helpers/responses";

export const get = [
  rateLimiter({ requests: 100, within: 1 }),
  validateLensAccount,
  async (req: Request, res: Response) => {
    try {
      const identityToken = req.headers["x-identity-token"] as string;
      const payload = parseJwt(identityToken);
      const { id } = payload;

      if (!id) {
        return noBody(res);
      }

      const cacheKey = `preference:${id}`;
      const cachedData = await getRedis(cacheKey);

      if (cachedData) {
        logger.info(`(cached) Profile preferences fetched for ${id}`);
        return res
          .status(200)
          .json({ result: JSON.parse(cachedData), success: true });
      }

      const [preference, permissions, email, membershipNft] =
        await prisma.$transaction([
          prisma.preference.findUnique({ where: { id: id as string } }),
          prisma.profilePermission.findMany({
            include: { permission: { select: { key: true } } },
            where: { enabled: true, profileId: id as string }
          }),
          prisma.email.findUnique({ where: { id: id as string } }),
          prisma.membershipNft.findUnique({ where: { id: id as string } })
        ]);

      const response: Preferences = {
        appIcon: preference?.appIcon || 0,
        email: email?.email || null,
        emailVerified: Boolean(email?.verified),
        hasDismissedOrMintedMembershipNft: Boolean(
          membershipNft?.dismissedOrMinted
        ),
        highSignalNotificationFilter: Boolean(
          preference?.highSignalNotificationFilter
        ),
        permissions: permissions.map(({ permission }) => permission.key)
      };

      await setRedis(cacheKey, response);
      logger.info(`Profile preferences fetched for ${id}`);

      return res.status(200).json({ result: response, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
