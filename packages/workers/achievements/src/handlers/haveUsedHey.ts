import { Errors } from '@hey/data/errors';
import response from '@hey/lib/response';

import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  const { id } = request.params;

  if (!id) {
    return response({ success: false, error: Errors.NoBody });
  }

  try {
    const clickhouseResponse = await fetch(
      `${request.env.CLICKHOUSE_REST_ENDPOINT}&default_format=JSONCompact`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cf: { cacheTtl: 600, cacheEverything: true },
        body: `SELECT count(*) FROM events WHERE actor = '${id}';`
      }
    );

    if (clickhouseResponse.status !== 200) {
      return response({ success: false, error: Errors.StatusCodeIsNot200 });
    }

    const json: {
      data: [string][];
    } = await clickhouseResponse.json();

    return response({
      success: true,
      haveUsedHey: parseInt(json.data[0][0]) > 0
    });
  } catch (error) {
    throw error;
  }
};
