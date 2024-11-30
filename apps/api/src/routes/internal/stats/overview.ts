import prisma from "@hey/db/prisma/db/client";
import logger from "@hey/helpers/logger";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import validateIsStaff from "src/helpers/middlewares/validateIsStaff";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";

export const get = [
  validateLensAccount,
  validateIsStaff,
  async (_: Request, res: Response) => {
    try {
      const result = await prisma.$transaction([
        prisma.profilePermission.count(),
        prisma.email.count(),
        prisma.membershipNft.count(),
        prisma.poll.count(),
        prisma.pollOption.count(),
        prisma.pollResponse.count(),
        prisma.preference.count(),
        prisma.profileStatus.count(),
        prisma.profileTheme.count(),
        prisma.tip.count()
      ]);

      logger.info("Fetched overview stats");

      return res.status(200).json({
        result: {
          profilePermissions: result[0],
          emails: result[1],
          membershipNfts: result[2],
          polls: result[3],
          pollOptions: result[4],
          pollResponses: result[5],
          preferences: result[6],
          accountStatuses: result[7],
          profileThemes: result[8],
          tips: result[9]
        },
        success: true
      });
    } catch (error) {
      catchedError(res, error);
    }
  }
];
