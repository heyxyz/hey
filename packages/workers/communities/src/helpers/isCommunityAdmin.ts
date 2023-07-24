import { Client } from 'pg';

import type { Env } from '../types';

const isCommunityAdmin = async (
  env: Env,
  profileId: string,
  communityId: string
): Promise<boolean> => {
  try {
    const client = new Client(env.DB_URL);
    await client.connect();

    const query = {
      text: `
      SELECT admin
      FROM communities
      WHERE id = $1 AND admin = $2;
    `,
      values: [communityId, profileId]
    };

    const result = await client.query(query);

    return result.rows.length > 0;
  } catch {
    return false;
  }
};

export default isCommunityAdmin;
