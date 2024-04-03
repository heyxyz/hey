import { Errors } from '@hey/data/errors';
import { PUBLICATION } from '@hey/data/tracking';
import logger from '@hey/lib/logger';
import createClickhouseClient from 'src/lib/createClickhouseClient';
import randomizeIds from 'src/lib/feeds/randomizeIds';

const interactionAndWeights = {
  [PUBLICATION.ATTACHMENT.AUDIO.PLAY]: 4,
  [PUBLICATION.ATTACHMENT.IMAGE.OPEN]: 4,
  [PUBLICATION.BOOKMARK]: 3,
  [PUBLICATION.CLICK_OEMBED]: 1,
  [PUBLICATION.COLLECT_MODULE.COLLECT]: 10,
  [PUBLICATION.COPY_TEXT]: 1,
  [PUBLICATION.LIKE]: 5,
  [PUBLICATION.MIRROR]: 8,
  [PUBLICATION.SHARE]: 6,
  [PUBLICATION.TRANSLATE]: 1
};
const interactionEvents = Object.keys(interactionAndWeights);

const generateWeightedCaseStatement = () => {
  return Object.entries(interactionAndWeights)
    .map(([action, weight]) => `WHEN name = '${action}' THEN ${weight}`)
    .join(' ');
};

const heyMostInteracted = async (
  limit: number,
  offset: number
): Promise<any[]> => {
  if (limit > 500) {
    throw new Error(Errors.Limit500);
  }

  try {
    const client = createClickhouseClient();
    const rows = await client.query({
      format: 'JSONEachRow',
      query: `
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
      `
    });

    const result = await rows.json<{
      publication_id: string;
      weighted_interaction_count: number;
    }>();

    const ids = result.map((row) => row.publication_id);
    logger.info(`[Hey] Most interacted: ${ids.length} ids`);

    return randomizeIds(ids);
  } catch {
    return [];
  }
};

export default heyMostInteracted;
