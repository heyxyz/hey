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
      const result = await prisma.pro.groupBy({
        by: ["createdAt"],
        _count: { id: true },
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 30))
          }
        },
        orderBy: { createdAt: "asc" }
      });

      const formattedResult = result.map((item) => ({
        date: item.createdAt,
        count: item._count.id
      }));

      logger.info("Fetched pro revenue stats");

      return res.status(200).json({ result: formattedResult, success: true });
    } catch (error) {
      catchedError(res, error);
    }
  }
];
