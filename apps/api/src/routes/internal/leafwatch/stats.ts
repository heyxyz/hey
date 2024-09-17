import type { Request, Response } from "express";

import clickhouseClient from "@hey/db/clickhouseClient";
import logger from "@hey/helpers/logger";
import catchedError from "src/helpers/catchedError";
import validateIsStaff from "src/helpers/middlewares/validateIsStaff";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";

export const get = [
  validateLensAccount,
  validateIsStaff,
  async (_: Request, res: Response) => {
    try {
      const queries: string[] = [
        `
          SELECT
            COUNTIf(toDateTime(created) >= now() - INTERVAL 1 HOUR) AS last_1_hour,
            COUNTIf(toDate(created) = today()) AS today,
            COUNTIf(toDate(created) = yesterday()) AS yesterday,
            COUNTIf(toDate(created) >= toMonday(now())) AS this_week,
            COUNTIf(toDate(created) >= toStartOfMonth(now())) AS this_month,
            COUNT(*) AS all_time
          FROM events
        `,
        `
          SELECT
            COUNTIf(toDateTime(viewed) >= now() - INTERVAL 1 HOUR) AS last_1_hour,
            COUNTIf(toDate(viewed) = today()) AS today,
            COUNTIf(toDate(viewed) = yesterday()) AS yesterday,
            COUNTIf(toDate(viewed) >= toMonday(now())) AS this_week,
            COUNTIf(toDate(viewed) >= toStartOfMonth(now())) AS this_month,
            COUNT(*) AS all_time
          FROM impressions
        `,
        `
          SELECT 
            toStartOfInterval(created, INTERVAL 10 MINUTE) AS timestamp,
            COUNT(*) AS count
          FROM events
          WHERE toDate(created) = today()
          GROUP BY timestamp
          ORDER BY timestamp
        `,
        `
          SELECT 
            toStartOfInterval(viewed, INTERVAL 10 MINUTE) AS timestamp,
            COUNT(*) AS count
          FROM impressions
          WHERE toDate(viewed) = today()
          GROUP BY timestamp
          ORDER BY timestamp
        `,
        `
          SELECT
            CAST(created AS date) AS date,
            COUNT(DISTINCT COALESCE(actor, fingerprint, CAST(ip AS String))) AS dau,
            COUNT(*) AS events
          FROM
            events
          WHERE
            created >= DATE_SUB(NOW(), INTERVAL 10 DAY)
            AND created < NOW()
          GROUP BY CAST(created AS date)
          ORDER BY CAST(created AS date) DESC    
        `,
        `
          SELECT
            CAST(viewed AS date) AS date,
            COUNT(*) AS impressions
          FROM impressions
          WHERE
            viewed >= DATE_SUB(NOW(), INTERVAL 10 DAY)
            AND viewed < NOW()
          GROUP BY CAST(viewed AS date)
          ORDER BY CAST(viewed AS date) DESC    
        `,
        `
          SELECT
            referrer,
            COUNT(DISTINCT COALESCE(actor, fingerprint, CAST(ip AS String))) AS count
          FROM events
          WHERE toDate(created) = today() 
            AND referrer IS NOT NULL 
            AND actor IS NOT NULL
          GROUP BY referrer
          ORDER BY count DESC
          LIMIT 10
        `
      ];

      // Execute all queries concurrently
      const results: any = await Promise.all(
        queries.map((query) =>
          clickhouseClient
            .query({ format: "JSONEachRow", query })
            .then((rows) => rows.json())
        )
      );

      logger.info("Fetched Leafwatch stats");

      return res.status(200).json({
        dau: results[4].map((row: any, index: number) => ({
          date: row.date,
          dau: row.dau,
          events: row.events,
          impressions: results[5][index].impressions
        })),
        events: results[0][0],
        eventsToday: results[2],
        impressions: results[1][0],
        impressionsToday: results[3],
        referrers: results[6],
        success: true
      });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
