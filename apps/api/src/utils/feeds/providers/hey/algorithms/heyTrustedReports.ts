import { Errors } from '@hey/data/errors';
import logger from '@hey/lib/logger';
import createClickhouseClient from '@utils/createClickhouseClient';

const heyTrustedReports = async (
  limit: number,
  offset: number
): Promise<any[]> => {
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
          count(*) as count
        FROM trusted_reports
        WHERE resolved = 0
        GROUP BY publication_id
        ORDER BY count DESC
        LIMIT ${limit}
        OFFSET ${offset};
      `
    });

    const result = await rows.json<Array<{ id: string }>>();

    const ids = result.map((r) => r.id);
    logger.info(`[Hey] Trusted reports: ${ids.length} ids`);

    return ids;
  } catch {
    return [];
  }
};

export default heyTrustedReports;
