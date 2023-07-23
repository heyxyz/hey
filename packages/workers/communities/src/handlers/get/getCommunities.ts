import { error } from 'itty-router';
import { Client } from 'pg';

import type { Env } from '../../types';

export default async (profileId: string, offset: string, env: Env) => {
  if (!profileId) {
    return error(400, 'Bad request!');
  }

  try {
    const client = new Client(env.DB_URL);
    await client.connect();

    const query = {
      text: `
        SELECT
          m.id,
          c.*,
          COALESCE(mc.members_count, 0) AS members_count
        FROM
          memberships AS m
        JOIN communities AS c ON m.community_id = c.id
        LEFT JOIN (
          SELECT
            community_id,
            COUNT(profile_id)::integer AS members_count
          FROM
            memberships
          GROUP BY
            community_id
        ) AS mc ON m.community_id = mc.community_id
        WHERE
          m.profile_id = $1
        LIMIT 10 OFFSET $2;
      `,
      values: [profileId, offset]
    };

    const result = await client.query(query);

    return new Response(JSON.stringify(result.rows));
  } catch (error) {
    throw error;
  }
};
