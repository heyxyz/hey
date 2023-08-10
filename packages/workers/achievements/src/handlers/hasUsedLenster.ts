import { Errors } from '@lenster/data/errors';

import type { Env } from '../types';

export default async (id: string, env: Env) => {
  if (!id) {
    return new Response(
      JSON.stringify({ success: false, error: Errors.NoBody })
    );
  }

  try {
    const clickhouseResponse = await fetch(
      `${env.CLICKHOUSE_REST_ENDPOINT}&default_format=JSONCompact`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cf: { cacheTtl: 600, cacheEverything: true },
        body: `SELECT count(*) FROM events WHERE actor = '${id}';`
      }
    );

    if (clickhouseResponse.status !== 200) {
      return new Response(
        JSON.stringify({ success: false, error: Errors.StatusCodeIsNot200 })
      );
    }

    const json: {
      data: [string][];
    } = await clickhouseResponse.json();

    let response = new Response(
      JSON.stringify({
        success: true,
        hasUsedLenster: parseInt(json.data[0][0]) > 0
      })
    );

    // Cache for 10 minutes
    response.headers.set('Cache-Control', 'max-age=600');

    return response;
  } catch (error) {
    throw error;
  }
};
