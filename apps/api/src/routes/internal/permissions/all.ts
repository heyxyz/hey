import type { Request, Response } from "express";

import prisma from "@hey/db/prisma/db/client";
import logger from "@hey/helpers/logger";
import catchedError from "src/helpers/catchedError";
import validateIsStaff from "src/helpers/middlewares/validateIsStaff";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";

export const get = [
  validateLensAccount,
  validateIsStaff,
  async (_: Request, res: Response) => {
    try {
      const data = await prisma.permission.findMany({
        include: { _count: { select: { profiles: true } } }
      });

      logger.info("All permissions fetched");

      return res.status(200).json({ permissions: data, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
