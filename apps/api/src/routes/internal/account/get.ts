import prisma from "@hey/db/prisma/db/client";
import logger from "@hey/helpers/logger";
import type { InternalAccount } from "@hey/types/hey";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import validateHasCreatorToolsAccess from "src/helpers/middlewares/validateHasCreatorToolsAccess";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";
import { noBody } from "src/helpers/responses";

export const get = [
  validateLensAccount,
  validateHasCreatorToolsAccess,
  async (req: Request, res: Response) => {
    const accountAddress = req.query.address as string;

    if (!accountAddress) {
      return noBody(res);
    }

    try {
      const [preference, permissions, membershipNft, mutedWords] =
        await prisma.$transaction([
          prisma.preference.findUnique({ where: { accountAddress } }),
          prisma.accountPermission.findMany({
            include: { permission: { select: { key: true } } },
            where: { enabled: true, accountAddress }
          }),
          prisma.membershipNft.findUnique({ where: { accountAddress } }),
          prisma.mutedWord.findMany({ where: { accountAddress } })
        ]);

      const response: InternalAccount = {
        appIcon: preference?.appIcon || 0,
        hasDismissedOrMintedMembershipNft: Boolean(
          membershipNft?.dismissedOrMinted
        ),
        includeLowScore: Boolean(preference?.includeLowScore),
        permissions: permissions.map(({ permission }) => permission.key),
        mutedWords: mutedWords.map(({ id, word, expiresAt }) => ({
          id,
          word,
          expiresAt
        }))
      };

      logger.info(`Internal account fetched for ${accountAddress}`);

      return res.status(200).json({ result: response, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
