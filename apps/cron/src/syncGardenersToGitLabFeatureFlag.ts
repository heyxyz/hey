import lensPg from "@hey/db/lensPg";
import logger from "@hey/helpers/logger";

const syncGardenersToGitLabFeatureFlag = async () => {
  try {
    const response = await lensPg.query(
      `
        SELECT string_agg(profile_id::text, ',') AS profiles
        FROM custom_filters.reporting_gardener_profile;
      `
    );
    const profiles = response[0]?.profiles;

    const gitlabResponse = await fetch(
      "https://gitlab.com/api/v4/projects/61401782/feature_flags_user_lists/2",
      {
        body: JSON.stringify({ user_xids: profiles }),
        headers: {
          "Content-Type": "application/json",
          "PRIVATE-TOKEN": process.env.GITLAB_ACCESS_TOKEN
        },
        method: "PUT"
      }
    );

    if (gitlabResponse.status !== 200) {
      return logger.error(
        "[Cron] syncGardenersToGitLabFeatureFlag - Error syncing profiles to GitLab feature flag user list - Gardeners"
      );
    }

    return logger.info(
      "[Cron] syncGardenersToGitLabFeatureFlag - Updated GitLab feature flag user list - Gardeners"
    );
  } catch (error) {
    return logger.error(
      "[Cron] syncGardenersToGitLabFeatureFlag - Error syncing profiles to GitLab feature flag user list - Gardeners",
      error
    );
  }
};

export default syncGardenersToGitLabFeatureFlag;
