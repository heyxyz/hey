import createClickhouseClient from '@hey/clickhouse/createClickhouseClient';
import { Errors } from '@hey/data/errors';
import response from '@hey/lib/response';

import filteredEvents from '../helpers/filteredNames';
import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  const id = request.query.id as string;
  const date = request.query.date as string;

  if (!id) {
    return response({ success: false, error: Errors.NoBody });
  }

  try {
    const client = createClickhouseClient(request.env.CLICKHOUSE_PASSWORD);
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

    return response({
      success: true,
      data: list.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        return dateB.getTime() - dateA.getTime();
      })
    });
  } catch (error) {
    throw error;
  }
};
