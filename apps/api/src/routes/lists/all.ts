import prisma from "@hey/db/prisma/db/client";
import logger from "@hey/helpers/logger";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";
import { noBody } from "src/helpers/responses";

export const get = [
  rateLimiter({ requests: 500, within: 1 }),
  async (req: Request, res: Response) => {
    const { ownerId, viewingId } = req.query;

    if (!ownerId) {
      return noBody(res);
    }

    try {
      const data = await prisma.list.findMany({
        include: {
          _count: { select: { profiles: true, pinnedList: true } },
          profiles: { where: { profileId: viewingId as string } },
          pinnedList: { where: { profileId: ownerId as string } }
        },
        where: { createdBy: ownerId as string }
      });

      const result = data.map((list) => {
        const { _count, profiles, pinnedList, ...rest } = list;

        return {
          ...rest,
          totalProfiles: _count.profiles,
          totalPins: _count.pinnedList,
          pinned: pinnedList.length > 0,
          isAdded: profiles.length > 0
        };
      });

      logger.info(`Lists fetched for ${ownerId}`);

      return res.status(200).json({ result, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
