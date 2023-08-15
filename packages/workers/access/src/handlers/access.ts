import { Errors } from '@lenster/data/errors';
import response from '@lenster/lib/response';

import type { Env } from '../types';

export default async (id: string, env: Env) => {
  if (!id) {
    return response({ success: false, error: Errors.NoBody });
  }

  try {
    const clickhouseResponse = await fetch(
      `${env.CLICKHOUSE_REST_ENDPOINT}&default_format=JSONCompact`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cf: { cacheTtl: 600, cacheEverything: true },
        body: `SELECT * FROM rights WHERE id = '${id}';`
      }
    );

    if (clickhouseResponse.status !== 200) {
      return response({ success: false, error: Errors.StatusCodeIsNot200 });
    }

    const json: {
      data: [string, boolean, boolean, boolean][];
    } = await clickhouseResponse.json();

    return response({
      success: true,
      result: {
        id: json.data[0][0],
        isStaff: json.data[0][1],
        isGardener: json.data[0][2],
        isTrustedMember: json.data[0][3]
      }
    });
  } catch (error) {
    throw error;
  }
};
