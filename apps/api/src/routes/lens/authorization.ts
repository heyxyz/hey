import { PermissionId } from "@hey/data/permissions";
import prisma from "@hey/db/prisma/db/client";
import { getRedis, setRedis } from "@hey/db/redisClient";
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

      const cacheKey = `suspended:${account}`;
      const isSuspended = await getRedis(cacheKey);

      if (isSuspended) {
        logger.info(`(cached) Authorization request fullfilled for ${account}`);
        return res.status(200).json({
          allowed: true,
          sponsored: !JSON.parse(isSuspended),
          appVerificationEndpoint: VERIFICATION_ENDPOINT
        });
      }

      const accountPermission = await prisma.accountPermission.findFirst({
        where: {
          permissionId: PermissionId.Suspended,
          accountAddress: account as string
        }
      });

      await setRedis(
        cacheKey,
        JSON.stringify(accountPermission?.enabled ?? false)
      );

      if (accountPermission?.enabled) {
        logger.info(`Authorization request fullfilled for ${account}`);
        return res.status(200).json({
          allowed: true,
          sponsored: false,
          appVerificationEndpoint: VERIFICATION_ENDPOINT
        });
      }

      logger.info(`Authorization request fullfilled for ${account}`);

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
