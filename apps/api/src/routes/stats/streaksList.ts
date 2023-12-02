import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import { SWR_CACHE_AGE_1_MIN_30_DAYS } from '@utils/constants';
import createClickhouseClient from '@utils/createClickhouseClient';
import { noBody } from '@utils/responses';
import filteredEvents from '@utils/stats/filteredEvents';
import type { Handler } from 'express';

export const get: Handler = async (req, res) => {
  const { id, date } = req.query;

  if (!id) {
    return noBody(res);
  }

  try {
    const client = createClickhouseClient();
    const rows = await client.query({
      query: `
        SELECT
          id,
          name,
          created
        FROM events
        WHERE actor = '${id}' AND created >= now() - INTERVAL 1 YEAR
        AND name IN (${filteredEvents.map((name) => `'${name}'`).join(',')})
        ${
          date === 'latest'
            ? `
          AND DATE(created) = (
            SELECT MAX(DATE(created))
            FROM events
            WHERE actor = '${id}' 
            AND created >= now() - INTERVAL 1 YEAR
            AND name IN (${filteredEvents.map((name) => `'${name}'`).join(',')})
          )
        `
            : ''
        };
      `,
      format: 'JSONEachRow'
    });

    const result =
      await rows.json<Array<{ id: string; name: string; created: string }>>();

    const list = result.map(({ id, name, created }) => ({
      id,
      event: name,
      date: created
    }));
    logger.info(`Streaks list fetched for ${id}`);

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_1_MIN_30_DAYS)
      .json({
        success: true,
        data: list.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);

          return dateB.getTime() - dateA.getTime();
        })
      });
  } catch (error) {
    return catchedError(res, error);
  }
};
