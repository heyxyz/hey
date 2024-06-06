import logger from '@good/helpers/logger';
import goodPg from 'src/db/goodPg';
import lensPg from 'src/db/lensPg';

const replicateGardeners = async () => {
  if (process.env.NEXT_PUBLIC_LENS_NETWORK !== 'mainnet') {
    return;
  }

  const profiles = await lensPg.query(
    `SELECT * FROM custom_filters.reporting_gardener_profile`
  );

  logger.info(
    `Cron: replicateGardeners - Inserting / Updating ${profiles.length} profiles...`
  );

  for (const profile of profiles) {
    await goodPg.query(
      `
        INSERT INTO "ProfileFeature" ("profileId", "featureId", "enabled", "createdAt")
        VALUES ($1, $2, $3, now())
        ON CONFLICT ("profileId", "featureId") DO UPDATE
        SET enabled = true, "createdAt" = now()
      `,
      [profile.profile_id, '0a441129-182a-4a3f-83cf-a13c5ad8282b', true]
    );
  }

  logger.info(
    `Cron: replicateGardeners - Inserted ${profiles.length} gardener profiles`
  );
  logger.info(
    'Cron: replicateGardeners - Deleting old profiles that are not in the gardener list anymore...'
  );

  const deletedProfiles = await goodPg.query(
    `
      DELETE FROM "ProfileFeature"
      WHERE "profileId" != ALL($1)
      AND "featureId" = $2
    `,
    [
      profiles.map((profile) => profile.profile_id),
      '0a441129-182a-4a3f-83cf-a13c5ad8282b'
    ]
  );
  logger.info(
    `Cron: replicateGardeners - Deleted ${deletedProfiles} old profiles that are no longer a gardener`
  );
};

export default replicateGardeners;
