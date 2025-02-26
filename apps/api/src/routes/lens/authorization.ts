import { PermissionId } from "@hey/data/permissions";
import prisma from "@hey/db/prisma/db/client";
import logger from "@hey/helpers/logger";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { VERIFICATION_ENDPOINT } from "src/helpers/constants";
import { noBody } from "src/helpers/responses";

export const post = [
  async (req: Request, res: Response) => {
    const { body } = req;

    if (!body) {
      return noBody(res);
    }

    const { account } = body;

    try {
      logger.info(`Authorization request received for ${account}`);

      // TODO: Add redis cache
      const accountPermission = await prisma.accountPermission.findFirst({
        where: {
          permissionId: PermissionId.Suspended,
          accountAddress: account as string
        }
      });

      logger.info(`Authorization request fullfilled for ${account}`);

      if (accountPermission?.enabled) {
        return res.status(200).json({
          allowed: true,
          sponsored: false,
          appVerificationEndpoint: VERIFICATION_ENDPOINT
        });
      }

      return res.status(200).json({
        allowed: true,
        sponsored: true,
        appVerificationEndpoint: VERIFICATION_ENDPOINT
      });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
