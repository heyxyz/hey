import logger from '@hey/helpers/logger';
import createClickhouseClient from 'src/helpers/createClickhouseClient';

const clickhouse = createClickhouseClient();

const getAllDuplicatePublications = async () => {
  const rows = await clickhouse.query({
    format: 'JSONEachRow',
    query: `SELECT id FROM publications GROUP BY id HAVING count(*) > 1;`
  });

  const result = await rows.json<{ id: string }>();
  const ids = result.map((row) => row.id);

  return ids;
};

const deleteLensPublications = async () => {
  const duplicates = await getAllDuplicatePublications();

  if (duplicates.length === 0) {
    logger.info('Cron: No duplicate publications found.');
    return;
  }

  logger.info(`Cron: Found ${duplicates.length} duplicate publications`);

  duplicates.map(async (duplicate) => {
    const res = await clickhouse.query({
      format: 'JSONEachRow',
      query: `ALTER TABLE publications DELETE WHERE id = '${duplicate}'`
    });

    logger.info(
      `Cron: Deleted publication with id ${duplicate} - ${res.query_id}`
    );
  });
};

export default deleteLensPublications;
