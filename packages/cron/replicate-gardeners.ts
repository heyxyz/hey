import logger from '@hey/lib/logger';
import * as dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ override: true });

const { Client } = pg;
const lensClient = new Client({
  connectionString: process.env.LENS_DATABASE_URL
});
const heyClient = new Client({ connectionString: process.env.DATABASE_URL });

const main = async () => {
  await lensClient.connect();
  const profiles = await lensClient.query(
    `SELECT * FROM custom_filters.reporting_gardener_profile`
  );
  await lensClient.end();

  logger.info(`Inserting / Updating ${profiles.rows.length} profiles...`);

  await heyClient.connect();
  for (const profile of profiles.rows) {
    await heyClient.query(
      `
        INSERT INTO "ProfileFeature" ("profileId", "featureId", "enabled", "createdAt")
        VALUES ($1, $2, $3, now())
        ON CONFLICT ("profileId", "featureId") DO UPDATE
        SET enabled = true, "createdAt" = now()
      `,
      [profile.profile_id, '0a441129-182a-4a3f-83cf-a13c5ad8282b', true]
    );
    logger.info(`Inserted profile ${profile.profile_id}`);
  }

  logger.info(
    'Deleting old profiles that are not in the gardener list anymore...'
  );

  const deletedProfiles = await heyClient.query(
    `
      DELETE FROM "ProfileFeature"
      WHERE "profileId" != ALL($1)
      AND "featureId" = $2
    `,
    [
      profiles.rows.map((profile) => profile.profile_id),
      '0a441129-182a-4a3f-83cf-a13c5ad8282b'
    ]
  );
  logger.info(
    `Deleted ${deletedProfiles.rowCount} old profiles that are no longer a gardener`
  );

  await heyClient.end();
};

main();
