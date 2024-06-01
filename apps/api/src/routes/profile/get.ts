import type { ProfileDetails } from '@hey/types/hey';
import type { Handler } from 'express';

import logger from '@hey/helpers/logger';
import heyPg from 'src/db/heyPg';
import catchedError from 'src/helpers/catchedError';
import { SUSPENDED_FEATURE_ID } from 'src/helpers/constants';
import { noBody } from 'src/helpers/responses';

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  try {
    const [profileFeature, pinnedPublication, github, discord] =
      await heyPg.multi(
        `
          SELECT * FROM "ProfileFeature"
          WHERE enabled = TRUE
          AND "featureId" = $2
          AND "profileId" = $1;

          SELECT "publicationId" FROM "PinnedPublication" WHERE id = $1;

          SELECT "githubId", "username" FROM "GitHubConnection" WHERE id = $1;

          SELECT "discordId", "username" FROM "DiscordConnection" WHERE id = $1;
        `,
        [id as string, SUSPENDED_FEATURE_ID]
      );

    const response: ProfileDetails = {
      connections: {
        discord: discord[0]
          ? { id: discord[0].discordId, username: discord[0].username }
          : null,
        github: github[0]
          ? { id: github[0].githubId, username: github[0].username }
          : null
      },
      isSuspended: profileFeature[0]?.featureId === SUSPENDED_FEATURE_ID,
      pinnedPublication: pinnedPublication[0]?.publicationId || null
    };

    logger.info(`Profile details fetched for ${id}`);

    return res.status(200).json({ result: response, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
