import hasOwnedLensProfiles from '@lenster/lib/hasOwnedLensProfiles';
import validateLensAccount from '@lenster/lib/validateLensAccount';
import type { Community } from '@lenster/types/communities';
import jwt from '@tsndr/cloudflare-worker-jwt';
import { error, type IRequest } from 'itty-router';
import { Client } from 'pg';
import { boolean, object, string } from 'zod';

import type { Env } from '../../../types';

type ExtensionRequest = Community & {
  accessToken: string;
  isMainnet: boolean;
};

const validationSchema = object({
  id: string().uuid().optional().nullable(),
  name: string().min(1, { message: 'Name is required!' }),
  slug: string().min(1, { message: 'Slug is required!' }),
  description: string().optional().nullable(),
  image: string().optional().nullable(),
  nsfw: boolean().optional().nullable(),
  twitter: string().optional().nullable(),
  website: string().optional().nullable(),
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

  const {
    id,
    name,
    slug,
    description,
    avatar,
    nsfw,
    twitter,
    website,
    admin,
    accessToken,
    isMainnet
  } = body as ExtensionRequest;

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

    const createQuery = {
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

    const updateQuery = {
      text: `
        UPDATE communities
        SET
          name = $2,
          description = $3,
          avatar = $4,
          nsfw = $5,
          twitter = $6,
          website = $7
        WHERE id = $1
        RETURNING *;
      `,
      values: [id, name, description, avatar, nsfw, twitter, website]
    };

    const result = await client.query(id ? updateQuery : createQuery);

    return new Response(JSON.stringify(result.rows[0]));
  } catch (error) {
    throw error;
  }
};
