import type { Handler } from 'express';

import { GARDENER } from '@hey/data/tracking';
import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import createClickhouseClient from 'src/lib/createClickhouseClient';
import { noBody } from 'src/lib/responses';

// TODO: add tests
export const get: Handler = async (req, res) => {
  const { id, profile } = req.query;

  if (!id || !profile) {
    return noBody(res);
  }

  try {
    const client = createClickhouseClient();

    const queries: string[] = [
      `
        SELECT 
          actor,
          JSONExtractString(assumeNotNull(properties), 'publication_id') AS publication_id,
          (countIf(JSONExtractString(assumeNotNull(properties), 'type') = 'spam')
          + countIf(JSONExtractString(assumeNotNull(properties), 'type') = 'un-sponsor')
          + countIf(JSONExtractString(assumeNotNull(properties), 'type') = 'both')) > 0 AS has_reported
        FROM events
        WHERE name = '${GARDENER.REPORT}'
        AND actor = '${profile}'
        AND has(JSONExtractKeys(assumeNotNull(properties)), 'publication_id')
        GROUP BY actor, publication_id
        HAVING publication_id = '${id}'
      `,
      `
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
    ];

    // Execute all queries concurrently
    const results: any = await Promise.all(
      queries.map((query) =>
        client
          .query({ format: 'JSONEachRow', query })
          .then((rows) => rows.json())
      )
    );

    const formattedResults = {
      actor: results[0][0]?.actor,
      both: parseInt(results[1][0]?.both),
      hasReported: results[0][0]?.has_reported === 1,
      id: results[0][0]?.publication_id,
      spam: parseInt(results[1][0]?.spam),
      unSponsor: parseInt(results[1][0]?.un_sponsor)
    };

    logger.info(
      `Fetched Gardener report data for publication ${id} by ${profile}`
    );

    return res.status(200).json({
      result: formattedResults,
      success: true
    });
  } catch (error) {
    return catchedError(res, error);
  }
};
