import prisma from "@hey/db/prisma/db/client";
import logger from "@hey/helpers/logger";
import parseJwt from "@hey/helpers/parseJwt";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";
import { invalidBody, noBody } from "src/helpers/responses";
import { object, string } from "zod";

interface ExtensionRequest {
  name: string;
  description: string | null;
  avatar: string | null;
}

const validationSchema = object({
  name: string().min(1).max(100),
  description: string().min(1).max(1000).optional(),
  avatar: string().min(1).max(1000).optional()
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
      return invalidBody(res);
    }

    const { name, description, avatar } = body as ExtensionRequest;

    try {
      const identityToken = req.headers["x-identity-token"] as string;
      const payload = parseJwt(identityToken);

      const count = await prisma.list.count({
        where: { createdBy: payload.id }
      });

      if (count >= 50) {
        return catchedError(
          res,
          new Error("You have reached the maximum number of lists!"),
          400
        );
      }

      const list = await prisma.list.create({
        data: { name, description, avatar, createdBy: payload.id }
      });

      logger.info(`Created a list ${list.id}`);

      return res.status(200).json({ result: list, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
