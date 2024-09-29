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
      const records = await prisma.pro.findMany({
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 30))
          }
        },
        orderBy: { createdAt: "asc" }
      });

      const groupedResults = records.reduce((acc: any, record: any) => {
        const date = record.createdAt.toISOString().split("T")[0];

        if (!acc[date]) {
          acc[date] = { amount: 0 };
        }

        acc[date].amount += record.amount;
        return acc;
      }, {});

      const formattedResult = Object.entries(groupedResults).map(
        ([date, { amount }]: any) => ({ date, amount })
      );

      logger.info("Fetched pro revenue stats");

      return res.status(200).json({ result: formattedResult, success: true });
    } catch (error) {
      catchedError(res, error);
    }
  }
];
