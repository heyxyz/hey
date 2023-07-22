import { error } from 'itty-router';
import { Client } from 'pg';

import type { Env } from '../types';

export default async (slug: string, env: Env) => {
  if (!slug) {
    return error(400, 'Bad request!');
  }

  try {
    const client = new Client(env.DB_URL);
    await client.connect();

    const query = {
      text: `
        SELECT
          c.*,
          COALESCE(m.members_count, 0)::integer AS members_count
        FROM
          communities AS c
        LEFT JOIN (
          SELECT
            community_id,
            COUNT(profile_id) AS members_count
          FROM
            memberships
          GROUP BY
            community_id
        ) AS m ON c.id = m.community_id
        WHERE
          c.slug = $1;
      `,
      values: [slug]
    };

    const result = await client.query(query);

    return new Response(JSON.stringify(result.rows[0]));
  } catch (error) {
    throw error;
  }
};
