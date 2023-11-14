import createClickhouseClient from '@hey/clickhouse/createClickhouseClient';
import { Errors } from '@hey/data/errors';
import response from '@hey/lib/response';

import filteredEvents from '../helpers/filteredNames';
import generateDateRangeDict from '../helpers/generateDateRangeDict';
import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  const id = request.query.id as string;

  if (!id) {
    return response({ success: false, error: Errors.NoBody });
  }

  try {
    const client = createClickhouseClient(request.env.CLICKHOUSE_PASSWORD);
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

    return response({ success: true, data: allDatesData });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
