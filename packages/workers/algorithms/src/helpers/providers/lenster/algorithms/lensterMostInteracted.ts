import { Errors } from '@lenster/data/errors';

import type { Env } from '../../../../types';
import clickhouseQuery from '../clickhouseQuery';

const lensterMostInteracted = async (
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
          IFNULL(JSONExtractString(properties, 'publication_id'), JSONExtractString(properties, 'collect_publication_id')) AS publication_id,
          COUNT(*) AS interaction_count
      FROM
          events
      WHERE
          name IN ('Mirror publication', 'Like publication', 'Copy publication text', 'Toggle publication bookmark',
                  'Open likes modal', 'Open mirrors modal', 'Open collectors modal', 'Collect publication')
          AND (JSONHas(properties, 'publication_id') OR JSONHas(properties, 'collect_publication_id'))
          AND created >= now() - INTERVAL 1 DAY
      GROUP BY
          publication_id
      HAVING
          publication_id IS NOT NULL
      AND
          publication_id != ''
      ORDER BY
          interaction_count DESC
      LIMIT ${limit}
      OFFSET ${offset};
    `;
    const response = await clickhouseQuery(query, env);
    const ids = response.map((row) => {
      const url = row[0];
      const id = url.split('/').pop();
      return id;
    });
    const randomIds = ids
      .sort(() => Math.random() - Math.random())
      .slice(0, parseInt(limit));

    return randomIds;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default lensterMostInteracted;
