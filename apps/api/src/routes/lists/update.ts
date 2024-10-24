import { Errors } from "@hey/data/errors";
import prisma from "@hey/db/prisma/db/client";
import logger from "@hey/helpers/logger";
import parseJwt from "@hey/helpers/parseJwt";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";
import { invalidBody, noBody } from "src/helpers/responses";
import { boolean, object, string } from "zod";

interface ExtensionRequest {
  id: string;
  name?: string;
  description?: string | null;
  avatar?: string | null;
  pinned?: boolean;
}

const validationSchema = object({
  id: string().uuid(),
  name: string().min(1).max(100).optional(),
  description: string().min(1).max(1000).optional(),
  avatar: string().min(1).max(1000).optional(),
  pinned: boolean().optional()
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

    const { id, name, description, avatar, pinned } = body as ExtensionRequest;

    try {
      const identityToken = req.headers["x-identity-token"] as string;
      const payload = parseJwt(identityToken);

      // Check if the list exists and belongs to the authenticated user
      const list = await prisma.list.findUnique({
        where: { id, createdBy: payload.id }
      });

      if (!list) {
        return catchedError(res, new Error(Errors.Unauthorized), 401);
      }

      const data = {
        name: name ?? list.name,
        description: description ?? list.description,
        avatar: avatar ?? list.avatar,
        pinned: pinned !== undefined ? pinned : list.pinned
      };

      const result = await prisma.list.update({ where: { id }, data });
      logger.info(`Updated a list ${result.id}`);

      return res.status(200).json({ result, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
