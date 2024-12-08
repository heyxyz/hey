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

      const accountTheme = await prisma.accountTheme.deleteMany({
        where: { accountAddress: payload.act.sub }
      });

      await delRedis(`preference:${payload.act.sub}`);
      logger.info(`Reset account theme for ${payload.act.sub}`);

      return res.status(200).json({ result: accountTheme, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
