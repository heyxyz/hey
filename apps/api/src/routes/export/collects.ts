import lensPg from "@hey/db/lensPg";
import dbId from "@hey/helpers/dbId";
import logger from "@hey/helpers/logger";
import { Parser } from "@json2csv/plainjs";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { CACHE_AGE_30_MINS } from "src/helpers/constants";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";
import { noBody } from "src/helpers/responses";

export const get = [
  rateLimiter({ requests: 10, within: 1 }),
  validateLensAccount,
  async (req: Request, res: Response) => {
    const { id } = req.query;

    if (!id) {
      return noBody(res);
    }

    try {
      const actionExecuted = await lensPg.query(
        `
          SELECT ae.account as address
          FROM post.action_executed AS ae
          WHERE ae.post_id = $1;
        `,
        [dbId(id as string)]
      );

      const fields = ["address"];
      const parser = new Parser({ fields });
      const csv = parser.parse(actionExecuted);

      logger.info(`[Lens] Exported collect addresses list for ${id}`);

      return res
        .status(200)
        .setHeader("Content-Type", "text/csv")
        .setHeader(
          "Content-Disposition",
          `attachment; filename="collect_addresses_${id}.csv"`
        )
        .setHeader("Cache-Control", CACHE_AGE_30_MINS)
        .send(csv);
    } catch (error) {
      catchedError(res, error);
    }
  }
];
