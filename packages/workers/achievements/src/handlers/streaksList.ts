import { Errors } from '@lenster/data/errors';
import response from '@lenster/lib/response';

import filteredEvents from '../helpers/filteredNames';
import type { Env } from '../types';

export default async (id: string, date: string, env: Env) => {
  if (!id) {
    return response({ success: false, error: Errors.NoBody });
  }

  try {
    const query = `
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
    `;

    const clickhouseResponse = await fetch(
      `${env.CLICKHOUSE_REST_ENDPOINT}&default_format=JSONCompact`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cf: { cacheTtl: 600, cacheEverything: true },
        body: query
      }
    );

    if (clickhouseResponse.status !== 200) {
      return response({ success: false, error: Errors.StatusCodeIsNot200 });
    }

    const json: {
      data: [string, string, string][];
    } = await clickhouseResponse.json();
    const list = json.data.map(([id, event, date]) => ({ id, event, date }));

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
