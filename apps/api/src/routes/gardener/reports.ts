import type { Handler } from 'express';

import { GARDENER } from '@hey/data/tracking';
import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
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
        SELECT 
          JSONExtractString(assumeNotNull(properties), 'publication_id') AS publication_id,
          countIf(JSONExtractString(assumeNotNull(properties), 'type') = 'spam') AS spam,
          countIf(JSONExtractString(assumeNotNull(properties), 'type') = 'un-sponsor') AS un_sponsor,
          countIf(JSONExtractString(assumeNotNull(properties), 'type') = 'both') AS both,
          countIf(JSONExtractString(assumeNotNull(properties), 'type') IN ('spam', 'un-sponsor', 'both')) AS total
        FROM events
        WHERE name = '${GARDENER.REPORT}'
        AND has(JSONExtractKeys(assumeNotNull(properties)), 'publication_id')
        AND JSONExtractString(assumeNotNull(properties), 'publication_id') = '${id}'
        GROUP BY publication_id
      `
    });

    const result = await rows.json<
      [
        {
          both: string;
          publication_id: string;
          spam: string;
          un_sponsor: string;
        }
      ]
    >();

    const formattedResults = {
      both: parseInt(result[0]?.both),
      id: result[0]?.publication_id,
      spam: parseInt(result[0]?.spam),
      unSponsor: parseInt(result[0]?.un_sponsor)
    };

    logger.info(`Fetched Gardener report data for publication ${id}`);

    return res.status(200).json({
      result: formattedResults,
      success: true
    });
  } catch (error) {
    return catchedError(res, error);
  }
};
