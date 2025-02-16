import prisma from "@hey/db/prisma/db/client";
import { getRedis, setRedis } from "@hey/db/redisClient";
import logger from "@hey/helpers/logger";
import parseJwt from "@hey/helpers/parseJwt";
import type { AccountTheme, Preferences } from "@hey/types/hey";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";
import { noBody } from "src/helpers/responses";

export const get = [
  rateLimiter({ requests: 100, within: 1 }),
  validateLensAccount,
  async (req: Request, res: Response) => {
    try {
      const idToken = req.headers["x-id-token"] as string;
      const payload = parseJwt(idToken);
      const accountAddress = payload.act.sub;

      if (!accountAddress) {
        return noBody(res);
      }

      const cacheKey = `preference:${accountAddress}`;
      const cachedData = await getRedis(cacheKey);

      if (cachedData) {
        logger.info(
          `(cached) Account preferences fetched for ${accountAddress}`
        );
        return res
          .status(200)
          .json({ result: JSON.parse(cachedData), success: true });
      }

      const [preference, permissions, membershipNft, theme, mutedWords] =
        await prisma.$transaction([
          prisma.preference.findUnique({ where: { accountAddress } }),
          prisma.accountPermission.findMany({
            include: { permission: { select: { key: true } } },
            where: { enabled: true, accountAddress }
          }),
          prisma.membershipNft.findUnique({ where: { accountAddress } }),
          prisma.accountTheme.findUnique({ where: { accountAddress } }),
          prisma.mutedWord.findMany({ where: { accountAddress } })
        ]);

      const response: Preferences = {
        appIcon: preference?.appIcon || 0,
        hasDismissedOrMintedMembershipNft: Boolean(
          membershipNft?.dismissedOrMinted
        ),
        includeLowScore: Boolean(preference?.includeLowScore),
        theme: (theme as AccountTheme) || null,
        permissions: permissions.map(({ permission }) => permission.key),
        mutedWords: mutedWords.map(({ id, word, expiresAt }) => ({
          id,
          word,
          expiresAt
        }))
      };

      await setRedis(cacheKey, response);
      logger.info(`Account preferences fetched for ${accountAddress}`);

      return res.status(200).json({ result: response, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
