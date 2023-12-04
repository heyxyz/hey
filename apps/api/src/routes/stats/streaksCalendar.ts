import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import { SWR_CACHE_AGE_1_MIN_30_DAYS } from '@utils/constants';
import createClickhouseClient from '@utils/createClickhouseClient';
import { noBody } from '@utils/responses';
import filteredEvents from '@utils/stats/filteredEvents';
import generateDateRangeDict from '@utils/stats/generateDateRangeDict';

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
          date(created) AS event_date,
          count(*) AS event_count
        FROM events
        WHERE actor = '${id}' AND created >= now() - INTERVAL 1 YEAR
        AND name IN (${filteredEvents.map((name) => `'${name}'`).join(',')})
        GROUP BY event_date
        ORDER BY event_date;
      `
    });

    const result =
      await rows.json<Array<{ event_count: number; event_date: string }>>();

    const eventData = result.reduce((acc: any, { event_count, event_date }) => {
      acc[event_date] = Number(event_count);
      return acc;
    }, {});

    const allDatesData = { ...generateDateRangeDict(), ...eventData };
    logger.info(`Streaks calendar fetched for ${id}`);

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_1_MIN_30_DAYS)
      .json({
        data: allDatesData,
        success: true
      });
  } catch (error) {
    return catchedError(res, error);
  }
};
