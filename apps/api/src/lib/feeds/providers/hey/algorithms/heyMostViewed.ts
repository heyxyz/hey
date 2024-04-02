import { Errors } from '@hey/data/errors';
import logger from '@hey/lib/logger';
import createClickhouseClient from 'src/lib/createClickhouseClient';
import randomizeIds from 'src/lib/feeds/randomizeIds';

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
          publication_id AS id,
          COUNT(*) AS view_count
        FROM impressions
        WHERE viewed_at > now() - INTERVAL 1 DAY
        GROUP BY id
        ORDER BY view_count DESC
        LIMIT ${limit}
        OFFSET ${offset};
      `
    });

    const result = await rows.json<{ id: string }>();

    const ids = result.map((r) => r.id);
    logger.info(`[Hey] Most viewed: ${ids.length} ids`);

    return randomizeIds(ids);
  } catch {
    return [];
  }
};

export default heyMostViewed;
