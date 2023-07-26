import { error } from 'itty-router';
import { Client } from 'pg';

import type { Env } from '../../types';

export default async (slug: string, env: Env) => {
  if (!slug) {
    return error(400, 'Bad request!');
  }

  try {
    const client = new Client(env.DB_URL);
    await client.connect();

    const query = {
      text: `
      SELECT *
      FROM communities
      WHERE slug LIKE '%' || $1 || '%'; 
      `,
      values: [slug]
    };

    const result = await client.query(query);
    const communutites = result.rows;

    return new Response(JSON.stringify(communutites));
  } catch (error) {
    throw error;
  }
};
