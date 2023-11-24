import { Errors } from '@hey/data/errors';
import allowCors from '@utils/allowCors';
import { SWR_CACHE_AGE_1_MIN_30_DAYS } from '@utils/constants';
import createClickhouseClient from '@utils/createClickhouseClient';
import filteredEvents from '@utils/stats/filteredEvents';
import generateDateRangeDict from '@utils/stats/generateDateRangeDict';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  try {
    const client = createClickhouseClient();
    const rows = await client.query({
      query: `
        SELECT
          date(created) AS event_date,
          count(*) AS event_count
        FROM events
        WHERE actor = '${id}' AND created >= now() - INTERVAL 1 YEAR
        AND name IN (${filteredEvents.map((name) => `'${name}'`).join(',')})
        GROUP BY event_date
        ORDER BY event_date;
      `,
      format: 'JSONEachRow'
    });

    const result =
      await rows.json<Array<{ event_date: string; event_count: number }>>();

    const eventData = result.reduce((acc: any, { event_date, event_count }) => {
      acc[event_date] = Number(event_count);
      return acc;
    }, {});

    const allDatesData = { ...generateDateRangeDict(), ...eventData };

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_1_MIN_30_DAYS)
      .json({
        success: true,
        data: allDatesData
      });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
