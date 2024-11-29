import prisma from "@hey/db/prisma/db/client";
import { delRedis } from "@hey/db/redisClient";
import logger from "@hey/helpers/logger";
import parseJwt from "@hey/helpers/parseJwt";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";

export const post = [
  rateLimiter({ requests: 50, within: 1 }),
  validateLensAccount,
  async (req: Request, res: Response) => {
    try {
      const idToken = req.headers["x-id-token"] as string;
      const payload = parseJwt(idToken);

      const accountStatus = await prisma.profileStatus.deleteMany({
        where: { id: payload.id }
      });

      await delRedis(`account:${payload.id}`);
      logger.info(`Cleared profile status for ${payload.id}`);

      return res.status(200).json({ result: accountStatus, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
