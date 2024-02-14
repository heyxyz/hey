import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import createClickhouseClient from 'src/lib/createClickhouseClient';
import { noBody } from 'src/lib/responses';

export const get: Handler = async (req, res) => {
  const { id, trusted } = req.query;

  if (!id) {
    return noBody(res);
  }

  const table = trusted === 'true' ? 'trusted_reports' : 'reports';

  try {
    const client = createClickhouseClient();
    const rows = await client.query({
      format: 'JSONEachRow',
      query: `
        SELECT reason, count(*) as count
        FROM ${table}
        WHERE publication_id = '${id}'
        GROUP BY reason
        ORDER BY count DESC;
      `
    });

    const result = await rows.json<Array<{ count: string; reason: string }>>();
    logger.info(`Report details fetched for ${id}`);

    return res.status(200).json({
      result: result.map((row) => ({
        count: Number(row.count),
        reason: row.reason
      })),
      success: true
    });
  } catch (error) {
    return catchedError(res, error);
  }
};
