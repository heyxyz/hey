import { Errors } from '@hey/data/errors';
import response from '@hey/lib/response';

import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  const id = request.query.id as string;

  if (!id) {
    return response({ success: false, error: 'No id provided!' });
  }

  try {
    const clickhouseResponse = await fetch(
      `${request.env.CLICKHOUSE_REST_ENDPOINT}&default_format=JSONCompact`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cf: { cacheTtl: 600, cacheEverything: true },
        body: `
          SELECT
            splitByString('-', publication_id)[1] AS user_id_extracted,
            count() AS impressions
          FROM impressions
          WHERE splitByString('-', publication_id)[1] = '${id}'
          GROUP BY user_id_extracted;
        `
      }
    );

    if (clickhouseResponse.status !== 200) {
      return response({ success: false, error: Errors.StatusCodeIsNot200 });
    }

    const json: {
      data: [string][][];
    } = await clickhouseResponse.json();

    return response({
      success: true,
      impressions: Number(json.data?.[0]?.[1]) || 0
    });
  } catch (error) {
    throw error;
  }
};
