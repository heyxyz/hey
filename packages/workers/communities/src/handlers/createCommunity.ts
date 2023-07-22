import validateLensAccount from '@lenster/lib/validateLensAccount';
import type { Community } from '@lenster/types/communities';
import { error, type IRequest } from 'itty-router';
import { Client } from 'pg';
import { object, string } from 'zod';

import type { Env } from '../types';

type ExtensionRequest = Community & {
  accessToken: string;
};

const validationSchema = object({
  name: string().min(1, { message: 'Name is required!' }),
  slug: string().min(1, { message: 'Slug is required!' }),
  description: string().optional().nullable(),
  avatar: string().optional().nullable(),
  admin: string(),
  accessToken: string().regex(/^([\w=]+)\.([\w=]+)\.([\w+/=\-]*)/)
});

export default async (request: IRequest, env: Env) => {
  const body = await request.json();
  if (!body) {
    return error(400, 'Bad request!');
  }

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return new Response(
      JSON.stringify({ success: false, error: validation.error.issues })
    );
  }

  const { name, slug, description, avatar, admin, accessToken } =
    body as ExtensionRequest;

  try {
    const isAuthenticated = await validateLensAccount(accessToken, true);
    if (!isAuthenticated) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid access token!' })
      );
    }

    const client = new Client(env.DB_URL);
    await client.connect();

    // Create community
    const createQuery = {
      text: `
        INSERT INTO communities(name, slug, description, avatar, admin)
        VALUES($1, $2, $3, $4, $5)
        RETURNING *
      `,
      values: [name, slug, description, avatar, admin]
    };

    const createResult = await client.query(createQuery);

    // Join admin to community
    const communityId = createResult.rows[0].id;
    const joinAdminQuery = {
      text: `
        INSERT INTO memberships (id, profile_id, community_id)
        VALUES ($1, $2, $3)
        RETURNING *;
      `,
      values: [`${admin}_${communityId}`, admin, communityId]
    };

    await client.query(joinAdminQuery);

    return new Response(JSON.stringify(createResult.rows[0]));
  } catch (error) {
    throw error;
  }
};
