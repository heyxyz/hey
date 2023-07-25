import { Errors } from '@lenster/data/errors';
import { Regex } from '@lenster/data/regex';
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
  profileId: string;
  accessToken: string;
  isMainnet: boolean;
};

const validationSchema = object({
  id: string().uuid().optional().nullable(),
  communityId: string().uuid(),
  profileId: string(),
  accessToken: string().regex(Regex.accessToken),
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

  const { id, communityId, profileId, accessToken, isMainnet } =
    body as ExtensionRequest;

  try {
    const isAuthenticated = await validateLensAccount(accessToken, isMainnet);
    if (!isAuthenticated) {
      return new Response(
        JSON.stringify({ success: false, error: Errors.InvalidAccesstoken })
      );
    }

    const { payload } = jwt.decode(accessToken);
    const hasOwned = await hasOwnedLensProfiles(
      payload.id,
      profileId,
      isMainnet
    );
    if (!hasOwned) {
      return new Response(
        JSON.stringify({ success: false, error: Errors.InvalidProfileId })
      );
    }

    const isAdmin = await isCommunityAdmin(env, profileId, communityId);
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ success: false, error: Errors.NotACommunityAdmin })
      );
    }

    const client = new Client(env.DB_URL);
    await client.connect();

    const query = {
      text: `
        DELETE FROM rules
        WHERE id = $1
        RETURNING *;
      `,
      values: [id]
    };

    const result = await client.query(query);

    return new Response(JSON.stringify(result.rows[0]));
  } catch (error) {
    throw error;
  }
};
