import { PermissionId } from "@hey/data/permissions";
import prisma from "@hey/db/prisma/db/client";
import { delRedis } from "@hey/db/redisClient";
import logger from "@hey/helpers/logger";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import validateIsStaff from "src/helpers/middlewares/validateIsStaff";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";
import { invalidBody, noBody } from "src/helpers/responses";
import { boolean, object, string } from "zod";

export const postUpdateTasks = async (
  profileId: string,
  permissionId: string
) => {
  await delRedis(`preference:${profileId}`);
  await delRedis(`profile:${profileId}`);
  if (permissionId === PermissionId.StaffPick) {
    // TODO: Send email to the user
    delRedis("staff-picks");
  }

  if (permissionId === PermissionId.Verified) {
    // TODO: Send email to the user
    await delRedis("verified");
  }
};

type ExtensionRequest = {
  enabled: boolean;
  id: string;
  profile_id: string;
};

const validationSchema = object({
  enabled: boolean(),
  id: string(),
  profile_id: string()
});

export const post = [
  validateLensAccount,
  validateIsStaff,
  async (req: Request, res: Response) => {
    const { body } = req;

    if (!body) {
      return noBody(res);
    }

    const validation = validationSchema.safeParse(body);

    if (!validation.success) {
      return invalidBody(res);
    }

    const { enabled, id, profile_id } = body as ExtensionRequest;

    try {
      if (enabled) {
        await prisma.profilePermission.create({
          data: { permissionId: id, profileId: profile_id }
        });

        await postUpdateTasks(profile_id, id);
        logger.info(`Enabled permissions for ${profile_id}`);

        return res.status(200).json({ enabled, success: true });
      }

      await prisma.profilePermission.deleteMany({
        where: { permissionId: id as string, profileId: profile_id as string }
      });

      await postUpdateTasks(profile_id, id);
      logger.info(`Disabled permissions for ${profile_id}`);

      return res.status(200).json({ enabled, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
