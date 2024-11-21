import prisma from "@hey/db/prisma/db/client";
import logger from "@hey/helpers/logger";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import validateHasCreatorToolsAccess from "src/helpers/middlewares/validateHasCreatorToolsAccess";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";
import { invalidBody, noBody } from "src/helpers/responses";
import { boolean, object, string } from "zod";
import { postUpdateTasks } from "../permissions/assign";

interface ExtensionRequest {
  enabled: boolean;
  id: string;
  accountId: string;
}

const validationSchema = object({
  enabled: boolean(),
  id: string(),
  accountId: string()
});

// TODO: Merge this with the one in permissions/assign
export const post = [
  validateLensAccount,
  validateHasCreatorToolsAccess,
  async (req: Request, res: Response) => {
    const { body } = req;

    if (!body) {
      return noBody(res);
    }

    const validation = validationSchema.safeParse(body);

    if (!validation.success) {
      return invalidBody(res);
    }

    const { enabled, id, accountId } = body as ExtensionRequest;

    try {
      if (enabled) {
        await prisma.profilePermission.create({
          data: { permissionId: id, profileId: accountId }
        });

        await postUpdateTasks(accountId, id, true);
        logger.info(`Enabled permissions for ${accountId}`);

        return res.status(200).json({ enabled, success: true });
      }

      await prisma.profilePermission.deleteMany({
        where: { permissionId: id as string, profileId: accountId as string }
      });

      await postUpdateTasks(accountId, id, false);
      logger.info(`Disabled permissions for ${accountId}`);

      return res.status(200).json({ enabled, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
