import prisma from "@hey/db/prisma/db/client";
import { delRedis } from "@hey/db/redisClient";
import logger from "@hey/helpers/logger";
import parseJwt from "@hey/helpers/parseJwt";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";
import { invalidBody, noBody, notFound } from "src/helpers/responses";
import { boolean, object, string } from "zod";

interface ExtensionRequest {
  id: string;
  pin: boolean;
}

const validationSchema = object({
  id: string().uuid(),
  pin: boolean()
});

export const post = [
  validateLensAccount,
  async (req: Request, res: Response) => {
    const { body } = req;

    if (!body) {
      return noBody(res);
    }

    const validation = validationSchema.safeParse(body);

    if (!validation.success) {
      console.log(validation.error);
      return invalidBody(res);
    }

    const { id, pin } = body as ExtensionRequest;

    try {
      const identityToken = req.headers["x-identity-token"] as string;
      const payload = parseJwt(identityToken);
      const listCacheKey = `list:${id}`;

      // Check if the list exists
      const list = await prisma.list.findUnique({ where: { id } });

      if (!list) {
        return notFound(res);
      }

      if (pin) {
        await prisma.pinnedList.create({
          data: { profileId: payload.id, listId: id }
        });
        await delRedis(listCacheKey);
        logger.info(`Pinned list ${id} for profile ${payload.id}`);

        return res.status(200).json({ success: true });
      }

      await prisma.pinnedList.delete({
        where: { profileId_listId: { profileId: payload.id, listId: id } }
      });
      await delRedis(listCacheKey);
      logger.info(`Unpinned list ${id} for profile ${payload.id}`);

      return res.status(200).json({ success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
