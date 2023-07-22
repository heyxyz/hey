import { error } from 'itty-router';
import { Client } from 'pg';

import type { Env } from '../types';

export default async (profileId: string, env: Env) => {
  if (!profileId) {
    return error(400, 'Bad request!');
  }

  try {
    const client = new Client(env.DB_URL);
    await client.connect();

    const query = {
      text: `
        SELECT community_id as id
        FROM memberships
        WHERE profile_id = $1;
      `,
      values: [profileId]
    };

    const result = await client.query(query);
    const ids = result.rows.map((row) => row.id);

    return new Response(JSON.stringify(ids));
  } catch (error) {
    throw error;
  }
};
