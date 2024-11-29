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
        prisma.list.count(),
        prisma.listProfile.count(),
        prisma.pinnedList.count(),
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
          lists: result[0],
          listProfiles: result[1],
          pinnedLists: result[2],
          profilePermissions: result[3],
          emails: result[4],
          membershipNfts: result[5],
          polls: result[6],
          pollOptions: result[7],
          pollResponses: result[8],
          preferences: result[9],
          accountStatuses: result[10],
          profileThemes: result[11],
          tips: result[12]
        },
        success: true
      });
    } catch (error) {
      catchedError(res, error);
    }
  }
];
