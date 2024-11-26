import prisma from "@hey/db/prisma/db/client";
import logger from "@hey/helpers/logger";
import parseJwt from "@hey/helpers/parseJwt";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";

export const get = [
  rateLimiter({ requests: 500, within: 1 }),
  validateLensAccount,
  async (req: Request, res: Response) => {
    try {
      const idToken = req.headers["x-id-token"] as string;
      const payload = parseJwt(idToken);

      const list = await prisma.list.findMany({
        include: {
          _count: { select: { profiles: true, pinnedList: true } },
          pinnedList: { where: { profileId: payload.id } }
        },
        where: { pinnedList: { some: { profileId: payload.id } } }
      });

      logger.info(`Pinned lists fetched for ${payload.id}`);

      return res.status(200).json({
        result: list.map((list) => {
          const { _count, pinnedList, ...rest } = list;

          return {
            ...rest,
            totalAccounts: _count.profiles,
            totalPins: _count.pinnedList,
            pinned: pinnedList.length > 0
          };
        }),
        success: true
      });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
