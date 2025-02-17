import { PermissionId } from "@hey/data/permissions";
import prisma from "@hey/db/prisma/db/client";
import logger from "@hey/helpers/logger";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { noBody } from "src/helpers/responses";

export const post = [
  async (req: Request, res: Response) => {
    const { body } = req;

    if (!body) {
      return noBody(res);
    }

    const { account } = body;

    try {
      logger.info("Authorization request received");

      const accountPermission = await prisma.accountPermission.findFirst({
        where: {
          permissionId: PermissionId.SoftSuspended,
          accountAddress: account as string
        }
      });

      logger.info("Authorization request fullfilled");

      if (accountPermission?.enabled) {
        return res.status(200).json({
          allowed: true,
          sponsored: false,
          appVerificationEndpoint: "https://bigint.ngrok.app/lens/verification"
        });
      }

      return res.status(200).json({
        allowed: true,
        sponsored: true,
        appVerificationEndpoint: "https://bigint.ngrok.app/lens/verification"
      });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
