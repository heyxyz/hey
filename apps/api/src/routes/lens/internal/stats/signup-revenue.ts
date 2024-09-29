import { HEY_LENS_SIGNUP } from "@hey/data/constants";
import lensPg from "@hey/db/lensPg";
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
      const result = await lensPg.query(
        `
          SELECT
            block_timestamp::date AS date,
            COUNT(*) AS signups_count
          FROM app.onboarding_profile
          WHERE
            onboarded_by_address = $1
            AND block_timestamp >= NOW() - INTERVAL '30 days'
          GROUP BY date
          ORDER BY date;
        `,
        [HEY_LENS_SIGNUP]
      );

      const formattedResult = result.map((row) => ({
        date: new Date(row.date).toISOString(),
        count: Number(row.signups_count)
      }));

      logger.info("[Lens] Fetched signup revenue stats");

      return res.status(200).json({ result: formattedResult, success: true });
    } catch (error) {
      catchedError(res, error);
    }
  }
];
