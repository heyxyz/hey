import { error } from 'itty-router';
import { Client } from 'pg';

import type { Env } from '../../types';

export default async (identifier: string, type: 'id' | 'slug', env: Env) => {
  if (!identifier) {
    return error(400, 'Bad request!');
  }

  try {
    const client = new Client(env.DB_URL);
    await client.connect();

    const query = {
      text: `
        SELECT
          c.*,
          COALESCE(m.members_count, 0)::integer AS members_count,
          (
            SELECT json_agg(json_build_object('id', r.id, 'title', r.title, 'description', r.description))
            FROM rules AS r
            WHERE r.community_id = c.id
          ) AS rules
        FROM communities AS c
        LEFT JOIN (
          SELECT
            community_id,
            COUNT(profile_id) AS members_count
          FROM memberships
          GROUP BY community_id
        ) AS m ON c.id = m.community_id
        WHERE ${type === 'id' ? 'c.id' : 'c.slug'} = $1;
      `,
      values: [identifier]
    };

    const result = await client.query(query);

    return new Response(JSON.stringify(result.rows[0]));
  } catch (error) {
    throw error;
  }
};
