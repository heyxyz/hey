import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import { SWR_CACHE_AGE_1_SEC_30_DAYS } from 'src/lib/constants';
import createClickhouseClient from 'src/lib/createClickhouseClient';
import { invalidBody, noBody } from 'src/lib/responses';
import { array, object, string } from 'zod';

type ExtensionRequest = {
  ids: string[];
};

const validationSchema = object({
  ids: array(string().max(2000, { message: 'Too many ids!' }))
});

export const post: Handler = async (req, res) => {
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

    const result = await rows.json<{ count: number; publication_id: string }>();

    const viewCounts = result.map((row) => ({
      id: row.publication_id,
      views: Number(row.count)
    }));
    logger.info(`Fetched publication views for ${ids.length} publications`);

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_1_SEC_30_DAYS)
      .json({ success: true, views: viewCounts });
  } catch (error) {
    return catchedError(res, error);
  }
};
