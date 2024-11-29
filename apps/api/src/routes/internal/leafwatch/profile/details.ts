import clickhouseClient from "@hey/db/clickhouseClient";
import logger from "@hey/helpers/logger";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import validateIsStaff from "src/helpers/middlewares/validateIsStaff";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";
import { noBody } from "src/helpers/responses";

export const get = [
  validateLensAccount,
  validateIsStaff,
  async (req: Request, res: Response) => {
    const { id } = req.query;

    if (!id) {
      return noBody(res);
    }

    try {
      const details = await clickhouseClient.query({
        format: "JSONEachRow",
        query: `
          WITH events_counts AS (
            SELECT
              actor,
              country,
              city,
              browser,
              COUNT() AS cnt
            FROM events
            WHERE actor = '${id}'
            GROUP BY actor, country, city, browser
          )
          SELECT
            actor,
            argMax(country, cnt) AS most_common_country,
            argMax(city, cnt) AS most_common_city,
            SUM(cnt) AS number_of_events,
            argMax(browser, cnt) AS mostCommonBrowser
          FROM events_counts
          WHERE actor = '${id}'
          GROUP BY actor;
        `
      });

      const result = await details.json<{
        actor: string;
        mostCommonBrowser: string;
        mostCommonCity: string;
        mostCommonCountry: string;
        numberOfEvents: string;
      }>();
      logger.info(`Account details fetched for ${id}`);

      return res.status(200).json({
        result: result[0]
          ? {
              actor: result[0].actor,
              browser: result[0].mostCommonBrowser,
              city: result[0].mostCommonCity,
              country: result[0].mostCommonCountry,
              events: Number.parseInt(result[0].numberOfEvents)
            }
          : null,
        success: true
      });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
