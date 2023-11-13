import createClickhouseClient from '@hey/clickhouse/createClickhouseClient';
import { Errors } from '@hey/data/errors';
import response from '@hey/lib/response';
import { array, object, string } from 'zod';

import type { WorkerRequest } from '../types';

type ExtensionRequest = {
  viewer_id: string;
  ids: string[];
};

const validationSchema = object({
  viewer_id: string().uuid(),
  ids: array(string())
});

export default async (request: WorkerRequest) => {
  const body = await request.json();
  if (!body) {
    return response({ success: false, error: Errors.NoBody });
  }

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return response({ success: false, error: validation.error.issues });
  }

  const { viewer_id, ids } = body as ExtensionRequest;
  try {
    const values = ids.map((id) => ({
      viewer_id,
      publication_id: id
    }));

    const client = createClickhouseClient(request.env.CLICKHOUSE_PASSWORD);
    const result = await client.insert({
      table: 'impressions',
      values,
      format: 'JSONEachRow'
    });

    return response({ success: true, id: result.query_id });
  } catch (error) {
    throw error;
  }
};
