import type { Handler } from 'express';

import logger from '@hey/helpers/logger';
import heyPg from 'src/db/heyPg';
import catchedError from 'src/helpers/catchedError';
import { noBody } from 'src/helpers/responses';

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  try {
    const [github, discord] = await heyPg.multi(
      `
        SELECT "githubId", "username" FROM "GitHubConnection" WHERE id = $1;
        SELECT "discordId", "username" FROM "DiscordConnection" WHERE id = $1;
      `,
      [id as string]
    );

    const result = {
      discord: { id: discord[0]?.discordId, username: discord[0]?.username },
      github: { id: github[0]?.githubId, username: github[0]?.username }
    };

    logger.info(`Profile connections fetched for ${id}`);

    return res.status(200).json({ result, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
