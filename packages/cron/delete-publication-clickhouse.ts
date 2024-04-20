import * as dotenv from 'dotenv';

import createClickhouseClient from './createClickhouseClient';

dotenv.config({ override: true });

const clickhouse = createClickhouseClient();

const getAllDuplicatePublications = async () => {
  const rows = await clickhouse.query({
    format: 'JSONEachRow',
    query: `
      SELECT id
      FROM publications
      GROUP BY id
      HAVING count(*) > 1;
    `
  });

  const result = await rows.json<{ id: string }>();
  const ids = result.map((row) => row.id);

  return ids;
};

const main = async () => {
  const duplicates = await getAllDuplicatePublications();

  if (duplicates.length === 0) {
    console.log('No duplicate publications found.');
    return;
  }

  console.log(`Found ${duplicates.length} duplicate publications`);

  duplicates.map(async (duplicate) => {
    const res = await clickhouse.query({
      format: 'JSONEachRow',
      query: `ALTER TABLE publications DELETE WHERE id = '${duplicate}'`
    });

    console.log(`Deleted publication with id ${duplicate} - ${res.query_id}`);
  });
};

main();
