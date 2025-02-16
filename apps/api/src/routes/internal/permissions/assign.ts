import { PermissionId } from "@hey/data/permissions";
import prisma from "@hey/db/prisma/db/client";
import { delRedis } from "@hey/db/redisClient";
import logger from "@hey/helpers/logger";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import validateIsStaff from "src/helpers/middlewares/validateIsStaff";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";
import { invalidBody, noBody } from "src/helpers/responses";
import sendSlackMessage from "src/helpers/slack";
import { boolean, object, string } from "zod";

export const postUpdateTasks = async (
  accountAddress: string,
  permissionId: string,
  enabled: boolean
) => {
  await delRedis(`preference:${accountAddress}`);
  await delRedis(`account:${accountAddress}`);

  await sendSlackMessage({
    channel: "#permissions",
    color: enabled ? "#16a34a" : "#dc2626",
    text: `:hey: Permission: ${permissionId} has been ${enabled ? "enabled" : "disabled"} for ${accountAddress}`
  });

  if (permissionId === PermissionId.StaffPick) {
    delRedis("staff-picks");
  }

  if (permissionId === PermissionId.Verified) {
    await delRedis("verified");
  }
};

interface ExtensionRequest {
  enabled: boolean;
  id: string;
  accountAddress: string;
}

const validationSchema = object({
  enabled: boolean(),
  id: string(),
  accountAddress: string()
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

    const { enabled, id, accountAddress } = body as ExtensionRequest;

    try {
      if (enabled) {
        await prisma.accountPermission.create({
          data: { permissionId: id, accountAddress }
        });

        await postUpdateTasks(accountAddress, id, true);
        logger.info(`Enabled permissions for ${accountAddress}`);

        return res.status(200).json({ enabled, success: true });
      }

      await prisma.accountPermission.deleteMany({
        where: { permissionId: id as string, accountAddress }
      });

      await postUpdateTasks(accountAddress, id, false);
      logger.info(`Disabled permissions for ${accountAddress}`);

      return res.status(200).json({ enabled, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
