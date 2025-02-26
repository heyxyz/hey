import prisma from "@hey/db/prisma/db/client";
import logger from "@hey/helpers/logger";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import validateIsStaff from "src/helpers/middlewares/validateIsStaff";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";

export const get = [
  validateLensAccount,
  validateIsStaff,
  async (_: Request, res: Response) => {
    try {
      const operations = await prisma.verificationOperationCount.findMany({
        select: { operation: true, count: true }
      });

      logger.info("Internal operations stats fetched");

      return res.status(200).json({ result: operations, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
