import { Errors } from '@lenster/data/errors';
import { PAGEVIEW } from '@lenster/data/tracking';

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
          name = '${PAGEVIEW}'
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

    const ids = response.map((row) => row[0]);
    const randomIds = ids
      .sort(() => Math.random() - Math.random())
      .slice(0, parseInt(limit));

    return randomIds;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default lensterMostViewed;
