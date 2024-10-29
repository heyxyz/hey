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
      const data = await prisma.$transaction([
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

      const result = {
        lists: data[0],
        listProfiles: data[1],
        pinnedLists: data[2],
        profilePermissions: data[3],
        emails: data[4],
        membershipNfts: data[5],
        polls: data[6],
        pollOptions: data[7],
        pollResponses: data[8],
        preferences: data[9],
        profileStatuses: data[10],
        profileThemes: data[11],
        tips: data[12]
      };

      logger.info("Fetched overview stats");

      return res.status(200).json({ result, success: true });
    } catch (error) {
      catchedError(res, error);
    }
  }
];
