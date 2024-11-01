import prisma from "@hey/db/prisma/db/client";
import { delRedis } from "@hey/db/redisClient";
import logger from "@hey/helpers/logger";
import parseJwt from "@hey/helpers/parseJwt";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";
import { invalidBody, noBody } from "src/helpers/responses";
import { boolean, number, object, string } from "zod";

interface ExtensionRequest {
  id?: string;
  appIcon?: number;
  highSignalNotificationFilter?: boolean;
  developerMode?: boolean;
}

const validationSchema = object({
  id: string().optional(),
  appIcon: number().optional(),
  highSignalNotificationFilter: boolean().optional(),
  developerMode: boolean().optional()
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

    const { appIcon, highSignalNotificationFilter, developerMode } =
      body as ExtensionRequest;

    try {
      const identityToken = req.headers["x-identity-token"] as string;
      const payload = parseJwt(identityToken);

      const data = { appIcon, highSignalNotificationFilter, developerMode };
      const preference = await prisma.preference.upsert({
        create: { ...data, id: payload.id },
        update: data,
        where: { id: payload.id }
      });

      await delRedis(`preference:${payload.id}`);
      logger.info(`Updated preferences for ${payload.id}`);

      return res.status(200).json({ result: preference, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
