import { Errors } from "@hey/data/errors";
import prisma from "@hey/db/prisma/db/client";
import { delRedis } from "@hey/db/redisClient";
import logger from "@hey/helpers/logger";
import parseJwt from "@hey/helpers/parseJwt";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";
import { invalidBody, noBody } from "src/helpers/responses";
import { object, string } from "zod";

interface ExtensionRequest {
  id: string;
}

const validationSchema = object({
  id: string().min(1)
});

// TODO: Add tests
export const post = [
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

    const { id } = body as ExtensionRequest;

    try {
      const identityToken = req.headers["x-identity-token"] as string;
      const payload = parseJwt(identityToken);
      const listCacheKey = `list:${id}`;
      const listProfilesCacheKey = `list:profiles:${id}`;

      const clearCache = async () => {
        await Promise.all([
          delRedis(listCacheKey),
          delRedis(listProfilesCacheKey)
        ]);
      };

      // Check if the list exists and belongs to the authenticated user
      const list = await prisma.list.findUnique({
        where: { id, createdBy: payload.id }
      });

      if (!list) {
        return catchedError(res, new Error(Errors.Unauthorized), 401);
      }

      await prisma.list.delete({
        where: { id }
      });
      await clearCache();
      logger.info(`Deleted a list ${id} by ${payload.id}`);

      return res.status(200).json({ success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
