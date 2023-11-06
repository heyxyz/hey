import createClickhouseClient from '@hey/clickhouse/createClickhouseClient';
import { Errors } from '@hey/data/errors';
import { PAGEVIEW } from '@hey/data/tracking';

import randomizeIds from '../../../helpers/randomizeIds';
import removeParamsFromString from '../../../helpers/removeParamsFromString';
import type { Env } from '../../../types';

const heyMostViewed = async (
  limit: number,
  offset: number,
  env: Env
): Promise<any[]> => {
  if (limit > 500) {
    throw new Error(Errors.Limit500);
  }

  try {
    const client = createClickhouseClient(env.CLICKHOUSE_PASSWORD);
    const rows = await client.query({
      query: `
        SELECT
          url,
          COUNT(*) AS view_count
        FROM
          events
        WHERE
          name = '${PAGEVIEW}'
          AND url LIKE 'https://hey.xyz/posts/%'
          AND created >= now() - INTERVAL 1 DAY
        GROUP BY
          url
        ORDER BY
          view_count DESC
        LIMIT ${limit}
        OFFSET ${offset};
      `,
      format: 'JSONEachRow'
    });

    const result =
      await rows.json<Array<{ url: string; view_count: number }>>();

    const ids = result.map((row) => {
      const { url } = row;
      const id = url.split('/').pop() || '';

      return removeParamsFromString(id);
    });

    return randomizeIds(ids);
  } catch {
    return [];
  }
};

export default heyMostViewed;
