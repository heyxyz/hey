import { Errors } from '@hey/data/errors';
import logger from '@hey/lib/logger';
import createClickhouseClient from 'src/lib/createClickhouseClient';

const heyReports = async (
  limit: number,
  offset: number,
  isTrusted = false
): Promise<any[]> => {
  if (limit > 500) {
    throw new Error(Errors.Limit500);
  }

  try {
    const client = createClickhouseClient();
    const table = isTrusted ? 'trusted_reports' : 'reports';
    const rows = await client.query({
      format: 'JSONEachRow',
      query: `
        SELECT
          publication_id AS id,
          count(*) as count
        FROM ${table}
        WHERE resolved = 0
        GROUP BY publication_id
        ORDER BY count DESC
        LIMIT ${limit}
        OFFSET ${offset};
      `
    });

    const result = await rows.json<Array<{ id: string }>>();

    const ids = result.map((r) => r.id);
    logger.info(`[Hey] Reports: ${ids.length} ids`);

    return ids;
  } catch {
    return [];
  }
};

export default heyReports;
