import { error } from 'itty-router';
import { Client } from 'pg';

import type { Env } from '../../types';

export default async (communityId: string, profileId: string, env: Env) => {
  if (!communityId || !profileId) {
    return error(400, 'Bad request!');
  }

  try {
    const client = new Client(env.DB_URL);
    await client.connect();

    const query = {
      text: `
        SELECT m.*, COUNT(*) AS count
        FROM memberships AS m
        WHERE m.community_id = $1
        AND m.profile_id = $2
        GROUP BY m.id;
      `,
      values: [communityId, profileId]
    };

    const result = await client.query(query);

    return new Response(
      JSON.stringify({
        success: true,
        isMember: result.rowCount > 0
      })
    );
  } catch (error) {
    throw error;
  }
};
