import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import lookup from 'country-code-lookup';
import catchedError from 'src/lib/catchedError';
import { SWR_CACHE_AGE_1_SEC_30_DAYS } from 'src/lib/constants';
import createClickhouseClient from 'src/lib/createClickhouseClient';
import { noBody } from 'src/lib/responses';

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
        SELECT country, COUNT(*) AS count
        FROM impressions
        WHERE publication_id = '${id}'
        GROUP BY country
        ORDER BY count DESC;
      `
    });

    const result = await rows.json<Array<{ count: number; country: string }>>();

    const locationDetails = result.map((row) => ({
      code: lookup.byCountry(row.country)?.iso2 || 'Unknown',
      country: row.country || 'Unknown',
      views: Number(row.count)
    }));
    logger.info(`Fetched publication views country details for ${id}`);

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_1_SEC_30_DAYS)
      .json({ result: locationDetails, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
