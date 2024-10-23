import lensPg from "@hey/db/lensPg";
import prisma from "@hey/db/prisma/db/client";
import logger from "@hey/helpers/logger";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";
import { invalidBody, noBody, notFound } from "src/helpers/responses";
import { object, string } from "zod";

interface ExtensionRequest {
  listId: string;
  profileId: string;
}

const validationSchema = object({
  listId: string().min(1),
  profileId: string().min(1)
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

    const { listId, profileId } = body as ExtensionRequest;

    try {
      const result = await lensPg.query(
        `
          SELECT EXISTS (
            SELECT 1 FROM profile.record
            WHERE profile_id = $1
            AND is_burnt = false
            LIMIT 1
          ) AS result;
        `,
        [listId, profileId]
      );

      const hasProfile = result[0]?.result;

      if (!hasProfile) {
        return notFound(res);
      }

      const listProfile = await prisma.listProfile.create({
        data: { listId, profileId }
      });

      logger.info(`Added profile ${profileId} to list ${listId}`);

      return res.status(200).json({ result: listProfile, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
