import prisma from "@hey/db/prisma/db/client";
import { delRedis } from "@hey/db/redisClient";
import logger from "@hey/helpers/logger";
import parseJwt from "@hey/helpers/parseJwt";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";
import { invalidBody, noBody } from "src/helpers/responses";
import { object, string } from "zod";

interface ExtensionRequest {
  fontStyle: string | null;
}

const validationSchema = object({
  fontStyle: string().optional()
});

export const post = [
  rateLimiter({ requests: 50, within: 1 }),
  validateLensAccount,
  async (req: Request, res: Response) => {
    const { body } = req;

    if (!body) {
      return noBody(res);
    }

    const validation = validationSchema.safeParse(body);

    if (!validation.success) {
      return invalidBody(res);
    }

    const { fontStyle } = body as ExtensionRequest;

    try {
      const idToken = req.headers["x-id-token"] as string;
      const payload = parseJwt(idToken);
      const dbPayload = { fontStyle };

      const accountTheme = await prisma.accountTheme.upsert({
        create: { accountAddress: payload.act.sub, ...dbPayload },
        update: dbPayload,
        where: { accountAddress: payload.act.sub }
      });

      await delRedis(`preference:${payload.act.sub}`);
      logger.info(`Updated account theme for ${payload.act.sub}`);

      return res.status(200).json({ result: accountTheme, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
