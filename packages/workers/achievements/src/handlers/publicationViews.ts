import { Errors } from '@hey/data/errors';
import response from '@hey/lib/response';
import { array, object, string } from 'zod';

import type { WorkerRequest } from '../types';

type ExtensionRequest = {
  ids: string[];
};

const validationSchema = object({
  ids: array(string().max(100, { message: 'Too many addresses!' }))
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
    const clickhouseResponse = await fetch(
      `${request.env.CLICKHOUSE_REST_ENDPOINT}&default_format=JSONCompact`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cf: { cacheTtl: 600, cacheEverything: true },
        body: `
          SELECT publication_id, COUNT(*) AS count
          FROM impressions
          WHERE publication_id IN (${ids.map((id) => `'${id}'`).join(',')})
          GROUP BY publication_id;        
        `
      }
    );

    if (clickhouseResponse.status !== 200) {
      return response({ success: false, error: Errors.StatusCodeIsNot200 });
    }

    const json: {
      data: [string][][];
    } = await clickhouseResponse.json();

    const viewCounts = json.data.map(([id, views]) => ({
      id: id,
      views: Number(views)
    }));

    return response({ success: true, views: viewCounts });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
