import { Errors } from '@lenster/data/errors';

import type { Env } from '../../../../types';
import clickhouseQuery from '../clickhouseQuery';

const lensterMostViewed = async (
  limit: string,
  offset: string,
  env: Env
): Promise<any[]> => {
  if (parseInt(limit) > 500) {
    throw new Error(Errors.Limit500);
  }

  try {
    const query = `
      SELECT
          url,
          COUNT(*) AS view_count
      FROM
          events
      WHERE
          name = 'Pageview'
          AND url LIKE 'https://lenster.xyz/posts/%'
          AND created >= now() - INTERVAL 1 DAY
      GROUP BY
          url
      ORDER BY
          view_count DESC
      LIMIT ${limit}
      OFFSET ${offset};
    `;
    const response = await clickhouseQuery(query, env);

    return response.map((row) => {
      const url = row[0];
      const id = url.split('/').pop();
      return id;
    });
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default lensterMostViewed;
