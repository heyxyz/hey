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
        SELECT actor, max(created) AS last_event_time
        FROM events
        WHERE actor IN (${ids.map((id) => `'${id}'`).join(',')})
        GROUP BY actor
        ORDER BY last_event_time DESC;
      `
    });

    const result =
      await rows.json<Array<{ actor: string; last_event_time: string }>>();

    const lastSeen = result.map((row) => ({
      id: row.actor,
      lastSeen: row.last_event_time
    }));
    logger.info(`Fetched last seen for ${ids.length} profiles`);

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_1_SEC_30_DAYS)
      .json({ success: true, views: lastSeen });
  } catch (error) {
    return catchedError(res, error);
  }
};
