import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import createClickhouseClient from 'src/lib/createClickhouseClient';
import { invalidBody, noBody } from 'src/lib/responses';
import { object, string } from 'zod';

type ExtensionRequest = {
  query: string;
};

const validationSchema = object({
  query: string()
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

  const { query } = body as ExtensionRequest;

  if (!query) {
    return invalidBody(res);
  }

  try {
    const client = createClickhouseClient('gpt', 'gpt');
    const rows = await client.query({
      clickhouse_settings: {
        add_http_cors_header: 1,
        max_result_bytes: '10000000',
        max_result_rows: '1000',
        result_overflow_mode: 'break'
      },
      format: 'JSONCompact',
      query
    });
    const result = await rows.json();
    logger.info('Query executed by GPT');

    return res.status(200).json({ result, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
