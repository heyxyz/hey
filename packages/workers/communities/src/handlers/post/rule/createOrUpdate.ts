import hasOwnedLensProfiles from '@lenster/lib/hasOwnedLensProfiles';
import validateLensAccount from '@lenster/lib/validateLensAccount';
import type { Rule } from '@lenster/types/communities';
import jwt from '@tsndr/cloudflare-worker-jwt';
import { error, type IRequest } from 'itty-router';
import { Client } from 'pg';
import { boolean, object, string } from 'zod';

import isCommunityAdmin from '../../../helpers/isCommunityAdmin';
import type { Env } from '../../../types';

type ExtensionRequest = Rule & {
  communityId: string;
  admin: string;
  accessToken: string;
  isMainnet: boolean;
};

const validationSchema = object({
  id: string().uuid().optional().nullable(),
  title: string().min(1, { message: 'Title is required!' }),
  description: string().min(1, { message: 'Description is required!' }),
  communityId: string().uuid(),
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

  const { id, title, description, communityId, admin, accessToken, isMainnet } =
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

    const isAdmin = await isCommunityAdmin(env, admin, communityId);
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ success: false, error: 'Not a community admin!' })
      );
    }

    const client = new Client(env.DB_URL);
    await client.connect();

    const createQuery = {
      text: `
        INSERT INTO rules (title, description, community_id)
        VALUES ($1, $2, $3)
        RETURNING *;
      `,
      values: [title, description, communityId]
    };

    const updateQuery = {
      text: `
        UPDATE rules
        SET title = $2, description = $3
        WHERE id = $1 AND community_id = $4
        RETURNING *;
      `,
      values: [id, title, description, communityId]
    };

    const result = await client.query(id ? updateQuery : createQuery);

    return new Response(JSON.stringify(result.rows[0]));
  } catch (error) {
    throw error;
  }
};
