import { Errors } from '@lenster/data/errors';
import { PUBLICATION } from '@lenster/data/tracking';

import type { Env } from '../../../../types';
import clickhouseQuery from '../clickhouseQuery';

const lensterMostInteracted = async (
  limit: number,
  offset: number,
  env: Env
): Promise<any[]> => {
  if (limit > 500) {
    throw new Error(Errors.Limit500);
  }

  try {
    const interactionEvents = [
      PUBLICATION.MIRROR,
      PUBLICATION.LIKE,
      PUBLICATION.COPY_TEXT,
      PUBLICATION.TOGGLE_BOOKMARK,
      PUBLICATION.SHARE,
      PUBLICATION.TRANSLATE,
      PUBLICATION.OPEN_LIKES,
      PUBLICATION.OPEN_MIRRORS,
      PUBLICATION.OPEN_COLLECTORS,
      PUBLICATION.ATTACHMENT.AUDIO.PLAY,
      PUBLICATION.COLLECT_MODULE.COLLECT
    ];

    const query = `
      SELECT
          IFNULL(JSONExtractString(properties, 'publication_id'), JSONExtractString(properties, 'collect_publication_id')) AS publication_id,
          COUNT(*) AS interaction_count
      FROM
          events
      WHERE
          name IN (${interactionEvents.map((name) => `'${name}'`).join(',')})
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
    const ids = response.map((row) => row[0]);
    const randomIds = ids
      .sort(() => Math.random() - Math.random())
      .slice(0, limit);

    return randomIds;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default lensterMostInteracted;
