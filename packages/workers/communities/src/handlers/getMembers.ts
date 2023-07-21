import { error } from 'itty-router';
import { Client } from 'pg';

import type { Env } from '../types';

export default async (communityId: string, offset: string, env: Env) => {
  if (!communityId) {
    return error(400, 'Bad request!');
  }

  try {
    const client = new Client(env.DB_URL);
    await client.connect();

    const query = {
      text: `
        SELECT id, profile_id
        FROM memberships
        WHERE community_id = $1
        LIMIT 20 OFFSET $2;
      `,
      values: [communityId, offset]
    };

    const result = await client.query(query);

    return new Response(JSON.stringify(result.rows));
  } catch (error) {
    throw error;
  }
};
