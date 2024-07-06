import type { Handler } from 'express';

import logger from '@hey/helpers/logger';
import catchedError from 'src/helpers/catchedError';
import createClickhouseClient from 'src/helpers/createClickhouseClient';
import { invalidBody, noBody } from 'src/helpers/responses';
import { number, object, string } from 'zod';

type ExtensionRequest = {
  delta: number;
  id: string;
  name: string;
};

const validationSchema = object({
  delta: number(),
  id: string(),
  name: string()
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

  const { delta, id, name } = body as ExtensionRequest;

  try {
    const client = createClickhouseClient();
    const values = { delta, id, name };
    const result = await client.insert({
      format: 'JSONEachRow',
      table: 'vitals',
      values: [values]
    });

    logger.info(
      `Ingested web vital to Leafwatch - ${values.name} - ${values.delta}`
    );

    return res.status(200).json({ id: result.query_id, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
