import { Errors } from '@lenster/data/errors';
import { PAGEVIEW } from '@lenster/data/tracking';

import randomizeIds from '../../../helpers/randomizeIds';
import removeParamsFromString from '../../../helpers/removeParamsFromString';
import type { Env } from '../../../types';
import clickhouseQuery from '../clickhouseQuery';

const lensterMostViewed = async (
  limit: number,
  offset: number,
  env: Env
): Promise<any[]> => {
  if (limit > 500) {
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

    const ids = response.map((row) => {
      const url = row[0];
      const id = url.split('/').pop();

      return removeParamsFromString(id);
    });

    return randomizeIds(ids);
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default lensterMostViewed;
