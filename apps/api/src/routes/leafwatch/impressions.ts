import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import createClickhouseClient from '@utils/createClickhouseClient';
import { invalidBody, noBody } from '@utils/responses';
import { array, object, string } from 'zod';

type ExtensionRequest = {
  ids: string[];
  viewer_id: string;
};

const validationSchema = object({
  ids: array(string()),
  viewer_id: string()
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

  const { ids, viewer_id } = body as ExtensionRequest;

  try {
    const values = ids.map((id) => ({
      publication_id: id,
      viewer_id
    }));

    const client = createClickhouseClient();
    const result = await client.insert({
      format: 'JSONEachRow',
      table: 'impressions',
      values
    });
    logger.info('Ingested impressions to Leafwatch');

    return res.status(200).json({ id: result.query_id, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
