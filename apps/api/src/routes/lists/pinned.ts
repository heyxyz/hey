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

      const result = await prisma.list.findMany({
        where: { pinnedList: { some: { profileId: payload.id } } }
      });

      logger.info(`Pinned lists fetched for ${payload.id}`);

      return res.status(200).json({ result, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
