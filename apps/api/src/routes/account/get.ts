import { PermissionId } from "@hey/data/permissions";
import prisma from "@hey/db/prisma/db/client";
import { getRedis, setRedis } from "@hey/db/redisClient";
import logger from "@hey/helpers/logger";
import type { AccountDetails } from "@hey/types/hey";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";
import { noBody } from "src/helpers/responses";

export const get = [
  rateLimiter({ requests: 250, within: 1 }),
  async (req: Request, res: Response) => {
    const { address } = req.query;

    if (!address) {
      return noBody(res);
    }

    try {
      const cacheKey = `account:${address}`;
      const cachedData = await getRedis(cacheKey);

      if (cachedData) {
        logger.info(`(cached) Account details fetched for ${address}`);
        return res
          .status(200)
          .json({ result: JSON.parse(cachedData), success: true });
      }

      const [accountPermission, accountStatus] = await prisma.$transaction([
        prisma.accountPermission.findFirst({
          where: {
            permissionId: PermissionId.Suspended,
            accountAddress: address as string
          }
        }),
        prisma.accountStatus.findUnique({
          where: { accountAddress: address as string }
        })
      ]);

      const response: AccountDetails = {
        isSuspended: accountPermission?.permissionId === PermissionId.Suspended,
        status: accountStatus || null
      };

      await setRedis(cacheKey, response);
      logger.info(`Account details fetched for ${address}`);

      return res.status(200).json({ result: response, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
