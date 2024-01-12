import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import createClickhouseClient from '@utils/createClickhouseClient';
import { noBody } from '@utils/responses';

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  try {
    const client = createClickhouseClient();
    const rows = await client.query({
      format: 'JSONEachRow',
      query: `
        SELECT 
          reason,
          count(*) as count
        FROM trusted_reports
        WHERE publication_id = '${id}'
        GROUP BY reason
        ORDER BY count DESC;
      `
    });

    const result = await rows.json<
      Array<{
        count: string;
        reason: string;
      }>
    >();
    logger.info(`Trusted report details fetched for ${id}`);

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
