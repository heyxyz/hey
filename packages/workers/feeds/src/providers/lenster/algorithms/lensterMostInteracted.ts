import { Errors } from '@lenster/data/errors';
import { PUBLICATION } from '@lenster/data/tracking';

import randomizeIds from '../../../helpers/randomizeIds';
import type { Env } from '../../../types';
import clickhouseQuery from '../clickhouseQuery';

const interactionAndWeights = {
  [PUBLICATION.COLLECT_MODULE.COLLECT]: 10,
  [PUBLICATION.MIRROR]: 8,
  [PUBLICATION.SHARE]: 6,
  [PUBLICATION.LIKE]: 5,
  [PUBLICATION.ATTACHMENT.AUDIO.PLAY]: 4,
  [PUBLICATION.ATTACHMENT.IMAGE.OPEN]: 4,
  [PUBLICATION.TOGGLE_BOOKMARK]: 3,
  [PUBLICATION.OPEN_MIRRORS]: 2,
  [PUBLICATION.OPEN_LIKES]: 2,
  [PUBLICATION.OPEN_COLLECTORS]: 2,
  [PUBLICATION.COPY_TEXT]: 1,
  [PUBLICATION.TRANSLATE]: 1,
  [PUBLICATION.CLICK_OEMBED]: 1
};
const interactionEvents = Object.keys(interactionAndWeights);

const generateWeightedCaseStatement = () => {
  return Object.entries(interactionAndWeights)
    .map(([action, weight]) => `WHEN name = '${action}' THEN ${weight}`)
    .join(' ');
};

const lensterMostInteracted = async (
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
          JSONExtractString(properties, 'publication_id') AS publication_id,
          SUM(CASE 
            ${generateWeightedCaseStatement()}
            ELSE 0
          END) AS weighted_interaction_count
      FROM
          events
      WHERE
          name IN (${interactionEvents.map((name) => `'${name}'`).join(',')})
          AND JSONHas(properties, 'publication_id')
          AND created >= now() - INTERVAL 1 DAY
      GROUP BY
          publication_id
      HAVING
          publication_id IS NOT NULL
      AND
          publication_id != ''
      ORDER BY
          weighted_interaction_count DESC
      LIMIT ${limit}
      OFFSET ${offset};
    `;
    const response = await clickhouseQuery(query, env);
    const ids = response.map((row) => row[0]);

    return randomizeIds(ids);
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default lensterMostInteracted;
