import { Errors } from '@hey/data/errors';
import type { NextApiRequest, NextApiResponse } from 'next';
import allowCors from 'utils/allowCors';
import { CACHE_AGE } from 'utils/constants';
import createClickhouseClient from 'utils/createClickhouseClient';
import filteredEvents from 'utils/stats/filteredEvents';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, date } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
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

    return res
      .status(200)
      .setHeader('Cache-Control', CACHE_AGE)
      .json({
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

export default allowCors(handler);
