import type { Request, Response } from "express";

import clickhouseClient from "@hey/db/clickhouseClient";
import logger from "@hey/helpers/logger";
import catchedError from "src/helpers/catchedError";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";
import { noBody } from "src/helpers/responses";

export const get = [
  rateLimiter({ requests: 250, within: 1 }),
  async (req: Request, res: Response) => {
    const { id } = req.query;

    if (!id) {
      return noBody(res);
    }

    try {
      const rows = await clickhouseClient.query({
        format: "JSONEachRow",
        query: `
          WITH
            date_series AS (
              SELECT toDate(subtractDays(now(), number)) AS date
              FROM numbers(30)
            ),
            impressions_extracted AS (
              SELECT
                toDate(viewed) AS date,
                splitByChar('-', publication)[1] AS actor
              FROM impressions
              WHERE
                splitByChar('-', publication)[1] = '${id}'
                AND viewed >= now() - INTERVAL 30 DAY
            )
          SELECT
            ds.date,
            count(ie.actor) AS count
          FROM date_series ds
          LEFT JOIN
            impressions_extracted ie
            ON ds.date = ie.date
          GROUP BY ds.date
          ORDER BY ds.date
        `
      });
      const result = await rows.json<{
        count: number;
        date: string;
      }>();
      const impressions = result.map((row) => ({
        count: Number(row.count),
        date: new Date(row.date).toISOString()
      }));

      logger.info("Fetched profile impression stats");

      return res.status(200).json({ impressions });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
