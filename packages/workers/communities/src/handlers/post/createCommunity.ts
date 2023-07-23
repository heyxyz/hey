import hasOwnedLensProfiles from '@lenster/lib/hasOwnedLensProfiles';
import validateLensAccount from '@lenster/lib/validateLensAccount';
import type { Community } from '@lenster/types/communities';
import jwt from '@tsndr/cloudflare-worker-jwt';
import { error, type IRequest } from 'itty-router';
import { Client } from 'pg';
import { boolean, object, string } from 'zod';

import type { Env } from '../../types';

type ExtensionRequest = Community & {
  accessToken: string;
  isMainnet: boolean;
};

const validationSchema = object({
  name: string().min(1, { message: 'Name is required!' }),
  slug: string().min(1, { message: 'Slug is required!' }),
  description: string().optional().nullable(),
  avatar: string().optional().nullable(),
  admin: string(),
  accessToken: string().regex(/^([\w=]+)\.([\w=]+)\.([\w+/=\-]*)/),
  isMainnet: boolean()
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

  const { name, slug, description, avatar, admin, accessToken, isMainnet } =
    body as ExtensionRequest;

  try {
    const isAuthenticated = await validateLensAccount(accessToken, isMainnet);
    if (!isAuthenticated) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid access token!' })
      );
    }

    const { payload } = jwt.decode(accessToken);
    const hasOwned = await hasOwnedLensProfiles(payload.id, admin, isMainnet);
    if (!hasOwned) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid profile ID' })
      );
    }

    const client = new Client(env.DB_URL);
    await client.connect();

    const query = {
      text: `
        WITH inserted_community AS (
          INSERT INTO communities(name, slug, description, avatar, admin)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id
        ),
        joined_admin AS (
          INSERT INTO memberships (id, profile_id, community_id)
          SELECT $6 || inserted_community.id, $5, inserted_community.id
          FROM inserted_community
          RETURNING *
        )
        SELECT * FROM joined_admin;
      `,
      values: [name, slug, description, avatar, admin, `${admin}_`]
    };

    const result = await client.query(query);

    return new Response(
      JSON.stringify({ success: true, id: result.rows[0].community_id })
    );
  } catch (error) {
    throw error;
  }
};
