import * as dotenv from 'dotenv';
import pg from 'pg';

import createClickhouseClient from './createClickhouseClient';

dotenv.config({ override: true });

const { Client } = pg;
const client = new Client({ connectionString: process.env.LENS_DATABASE_URL });
const clickhouse = createClickhouseClient();

const getLastBlockNumber = async () => {
  const rows = await clickhouse.query({
    format: 'JSONEachRow',
    query: 'SELECT max(block_number) as max_block_number FROM publications;'
  });

  const result = await rows.json<{ max_block_number: string }>();

  return parseInt(result[0].max_block_number);
};

const main = async () => {
  const START_BLOCK_NUMBER = await getLastBlockNumber();
  const END_BLOCK_NUMBER = START_BLOCK_NUMBER + 5000000;

  await client.connect();

  const res = await client.query(
    `
      SELECT
        pr.publication_id,
        pr.block_timestamp,
        pr.block_number,
        pm.content,
        pm.content_vector
      FROM
        publication.record pr
      JOIN
        publication.metadata pm ON pr.publication_id = pm.publication_id
      WHERE
        pr.block_number >= ${START_BLOCK_NUMBER} AND
        pr.block_number <= ${END_BLOCK_NUMBER} AND
        (pr.publication_type = 'POST' OR pr.publication_type = 'QUOTE')
      ORDER BY
        pr.block_number ASC;
    `
  );

  await client.end();

  console.log(
    `Inserting ${res.rows.length} publications - From block ${START_BLOCK_NUMBER} to ${END_BLOCK_NUMBER}`
  );

  // Define a batch size
  const BATCH_SIZE = 1000;
  let batches = [];
  let currentBatch = [];

  for (const row of res.rows) {
    // Create the data object for each row
    const value = {
      block_number: row.block_number,
      block_timestamp: row.block_timestamp,
      content: row.content,
      content_vector: row.content_vector,
      id: row.publication_id
    };

    // Add this object to the current batch
    currentBatch.push(value);

    // Check if the current batch size is reached
    if (currentBatch.length >= BATCH_SIZE) {
      // Push the current batch to batches and reset the current batch
      batches.push(currentBatch);
      currentBatch = [];
    }
  }

  // Add the last batch if it has any records
  if (currentBatch.length > 0) {
    batches.push(currentBatch);
  }

  // Execute all batches concurrently
  const insertPromises = batches.map((batch) => {
    return clickhouse
      .insert({
        format: 'JSONEachRow',
        table: 'publications',
        values: batch
      })
      .then((result) =>
        console.log(
          `Inserted batch of ${batch.length} publications, last ID: ${batch[batch.length - 1].id}, last block: ${batch[batch.length - 1].block_number} - ${result.query_id}`
        )
      );
  });

  Promise.all(insertPromises)
    .then(() => {
      console.log('All batches have been inserted successfully.');
    })
    .catch((error) => {
      console.error('Error inserting batches:', error);
    });
};

main();
