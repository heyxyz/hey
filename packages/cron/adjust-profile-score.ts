import logger from '@hey/helpers/logger';
import * as dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ override: true });

const { Client } = pg;
const heyClient = new Client({ connectionString: process.env.DATABASE_URL });

const main = async () => {
  const profileIds = [''];

  const values = profileIds.map((id) => `('${id}', 1000, 'GG19')`).join(', ');

  logger.info(`Inserting ${profileIds.length} profiles...`);

  await heyClient.connect();
  await heyClient.query(`
    INSERT INTO "AdjustedProfileScore" ("profileId", "score", "reason")
    VALUES ${values}
  `);
  await heyClient.end();

  logger.info('Inserted profile scores successfully!');
};

main();
