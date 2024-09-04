import lensPg from '@hey/db/lensPg';
import logger from '@hey/helpers/logger';

const syncProfilesToGitLabFeatureFlag = async () => {
  try {
    const response = await lensPg.query(
      `SELECT string_agg(profile_id::text, ',') AS all_ids FROM profile.record LIMIT 10;`
    );

    const profiles = response[0]?.all_ids;

    const gitlabResponse = await fetch(
      'https://gitlab.com/api/v4/projects/61401782/feature_flags_user_lists/2',
      {
        body: JSON.stringify({ user_xids: profiles }),
        headers: {
          'Content-Type': 'application/json',
          'PRIVATE-TOKEN': process.env.GITLAB_ACCESS_TOKEN
        },
        method: 'PUT'
      }
    );

    if (gitlabResponse.status !== 200) {
      return logger.error(
        '[Cron] syncProfilesToGitLabFeatureFlag - Error syncing profiles to GitLab feature flag'
      );
    }

    return logger.info(
      `[Cron] syncProfilesToGitLabFeatureFlag - Updated GitLab feature flag all profiles.`
    );
  } catch (error) {
    return logger.error(
      '[Cron] syncProfilesToGitLabFeatureFlag - Error syncing profiles to GitLab feature flag',
      error
    );
  }
};

export default syncProfilesToGitLabFeatureFlag;
