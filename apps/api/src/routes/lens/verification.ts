import { APP_NAME, HEY_APP } from "@hey/data/constants";
import { PermissionId } from "@hey/data/permissions";
import prisma from "@hey/db/prisma/db/client";
import logger from "@hey/helpers/logger";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { heyWalletClient } from "src/helpers/heyWalletClient";
import { noBody } from "src/helpers/responses";
import type { Address } from "viem";

const domain = {
  name: "Lens Source",
  version: "1",
  chainId: 37111,
  verifyingContract: HEY_APP as Address
} as const;

const types = {
  SourceStamp: [
    { name: "source", type: "address" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" }
  ]
} as const;

export const post = [
  async (req: Request, res: Response) => {
    const { body } = req;

    if (!body) {
      return noBody(res);
    }

    const source = HEY_APP as Address;
    const { nonce, deadline, account, operation } = body;

    try {
      logger.info(`Verification request received for ${operation}`);

      const [signature, accountPermission] = await Promise.all([
        heyWalletClient.signTypedData({
          domain,
          types,
          primaryType: "SourceStamp",
          message: { source, nonce, deadline }
        }),
        prisma.accountPermission.findFirst({
          where: {
            permissionId: PermissionId.Suspended,
            accountAddress: account as string
          }
        })
      ]);

      logger.info(`Verification request fullfilled for ${operation}`);

      if (accountPermission?.enabled) {
        return res.status(200).json({
          allowed: false,
          reason: `Account is suspended on ${APP_NAME}`
        });
      }

      return res.status(200).json({ allowed: true, signature });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
