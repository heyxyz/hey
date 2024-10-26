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
      const identityToken = req.headers["x-identity-token"] as string;
      const payload = parseJwt(identityToken);

      const data = await prisma.list.findMany({
        include: {
          _count: { select: { profiles: true, pinnedList: true } },
          pinnedList: { where: { profileId: payload.id } }
        },
        where: { pinnedList: { some: { profileId: payload.id } } }
      });

      const result = data.map((list) => {
        const { _count, pinnedList, ...rest } = list;

        return {
          ...rest,
          totalProfiles: _count.profiles,
          totalPins: _count.pinnedList,
          pinned: pinnedList.length > 0
        };
      });

      logger.info(`Pinned lists fetched for ${payload.id}`);

      return res.status(200).json({ result, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
