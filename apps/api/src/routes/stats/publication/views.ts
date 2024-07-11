import type { Request, Response } from 'express';

import logger from '@hey/helpers/logger';
import catchedError from 'src/helpers/catchedError';
import createClickhouseClient from 'src/helpers/createClickhouseClient';
import { rateLimiter } from 'src/helpers/middlewares/rateLimiter';
import { invalidBody, noBody } from 'src/helpers/responses';
import { array, object, string } from 'zod';

type ExtensionRequest = {
  ids: string[];
};

const validationSchema = object({
  ids: array(string().max(2000, { message: 'Too many ids!' }))
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
      const client = createClickhouseClient();
      const rows = await client.query({
        format: 'JSONEachRow',
        query: `
        SELECT publication_id, COUNT(*) AS count
        FROM impressions
        WHERE publication_id IN (${ids.map((id) => `'${id}'`).join(',')})
        GROUP BY publication_id;
      `
      });

      const result = await rows.json<{
        count: number;
        publication_id: string;
      }>();

      const viewCounts = result.map((row) => ({
        id: row.publication_id,
        views: Number(row.count)
      }));
      logger.info(`Fetched publication views for ${ids.length} publications`);

      return res.status(200).json({ success: true, views: viewCounts });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
