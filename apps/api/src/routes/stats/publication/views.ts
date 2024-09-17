import type { Request, Response } from "express";

import clickhouseClient from "@hey/db/clickhouseClient";
import logger from "@hey/helpers/logger";
import catchedError from "src/helpers/catchedError";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";
import { invalidBody, noBody } from "src/helpers/responses";
import { array, object, string } from "zod";

type ExtensionRequest = {
  ids: string[];
};

const validationSchema = object({
  ids: array(string().max(2000, { message: "Too many ids!" }))
});

export const post = [
  rateLimiter({ requests: 250, within: 1 }),
  async (req: Request, res: Response) => {
    const { body } = req;

    if (!body) {
      return noBody(res);
    }

    const validation = validationSchema.safeParse(body);

    if (!validation.success) {
      return invalidBody(res);
    }

    const { ids } = body as ExtensionRequest;

    try {
      const rows = await clickhouseClient.query({
        format: "JSONEachRow",
        query: `
          SELECT publication, count
          FROM total_impressions_per_publication_mv FINAL
          WHERE publication IN (${ids.map((id) => `'${id}'`).join(",")});
        `
      });

      const result = await rows.json<{
        count: number;
        publication: string;
      }>();

      const viewCounts = result.map((row) => ({
        id: row.publication,
        views: Number(row.count)
      }));
      logger.info(`Fetched publication views for ${ids.length} publications`);

      return res.status(200).json({ success: true, views: viewCounts });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
