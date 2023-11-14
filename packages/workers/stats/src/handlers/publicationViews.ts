import createClickhouseClient from '@hey/clickhouse/createClickhouseClient';
import { Errors } from '@hey/data/errors';
import response from '@hey/lib/response';
import { array, object, string } from 'zod';

import type { WorkerRequest } from '../types';

type ExtensionRequest = {
  ids: string[];
};

const validationSchema = object({
  ids: array(string().max(2000, { message: 'Too many ids!' }))
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

  const { ids } = body as ExtensionRequest;

  try {
    const client = createClickhouseClient(request.env.CLICKHOUSE_PASSWORD);
    const rows = await client.query({
      query: `
        SELECT publication_id, COUNT(*) AS count
        FROM impressions
        WHERE publication_id IN (${ids.map((id) => `'${id}'`).join(',')})
        GROUP BY publication_id;
      `,
      format: 'JSONEachRow'
    });

    const result =
      await rows.json<Array<{ publication_id: string; count: number }>>();

    const viewCounts = result.map((row) => ({
      id: row.publication_id,
      views: Number(row.count)
    }));

    return response({ success: true, views: viewCounts });
  } catch (error) {
    throw error;
  }
};
