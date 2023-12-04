import { Errors } from '@hey/data/errors';
import { PAGEVIEW } from '@hey/data/tracking';
import logger from '@hey/lib/logger';
import createClickhouseClient from '@utils/createClickhouseClient';
import randomizeIds from '@utils/feeds/randomizeIds';
import removeParamsFromString from '@utils/feeds/removeParamsFromString';

const heyMostViewed = async (limit: number, offset: number): Promise<any[]> => {
  if (limit > 500) {
    throw new Error(Errors.Limit500);
  }

  try {
    const client = createClickhouseClient();
    const rows = await client.query({
      format: 'JSONEachRow',
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
      `
    });

    const result =
      await rows.json<Array<{ url: string; view_count: number }>>();

    const ids = result.map((row) => {
      const { url } = row;
      const id = url.split('/').pop() || '';

      return removeParamsFromString(id);
    });
    logger.info(`[Hey] Most viewed: ${ids.length} ids`);

    return randomizeIds(ids);
  } catch {
    return [];
  }
};

export default heyMostViewed;
