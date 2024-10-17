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
  overviewFontStyle: string | null;
  publicationFontStyle: string | null;
}

const validationSchema = object({
  overviewFontStyle: string().optional(),
  publicationFontStyle: string().optional()
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

    const { overviewFontStyle, publicationFontStyle } =
      body as ExtensionRequest;

    try {
      const identityToken = req.headers["x-identity-token"] as string;
      const payload = parseJwt(identityToken);
      const dbPayload = { overviewFontStyle, publicationFontStyle };

      const data = await prisma.profileTheme.upsert({
        create: { id: payload.id, ...dbPayload },
        update: dbPayload,
        where: { id: payload.id }
      });

      await delRedis(`profile:${payload.id}`);
      logger.info(`Updated profile theme for ${payload.id}`);

      return res.status(200).json({ result: data, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
