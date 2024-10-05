import lensPg from "@hey/db/lensPg";
import prisma from "@hey/db/prisma/db/client";
import logger from "@hey/helpers/logger";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";
import { noBody } from "src/helpers/responses";
import type { Address } from "viem";
import { getAddress } from "viem";

export const get = [
  rateLimiter({ requests: 100, within: 1 }),
  async (req: Request, res: Response) => {
    const { address } = req.query;

    if (!address) {
      return noBody(res);
    }

    try {
      const formattedAddress = address
        ? getAddress(address as Address)
        : undefined;

      const data = await lensPg.query(
        `
          SELECT profile_id
          FROM profile_view pv
          WHERE pv.owned_by = $1
        `,
        [formattedAddress]
      );

      const profileIds = data.map(
        (row: { profile_id: string }) => row.profile_id
      );

      const proStatus = await prisma.pro.findFirst({
        where: { profileId: { in: profileIds }, expiresAt: { gt: new Date() } },
        orderBy: { expiresAt: "desc" }
      });

      const hasPro = !!proStatus?.expiresAt;

      logger.info(`Hey Pro status fetched for ${formattedAddress}`);

      return res.status(200).json({ hasPro, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
