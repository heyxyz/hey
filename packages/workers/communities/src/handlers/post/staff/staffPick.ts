import { Errors } from '@lenster/data/errors';
import { Regex } from '@lenster/data/regex';
import { adminAddresses } from '@lenster/data/staffs';
import validateLensAccount from '@lenster/lib/validateLensAccount';
import jwt from '@tsndr/cloudflare-worker-jwt';
import { error, type IRequest } from 'itty-router';
import { Client } from 'pg';
import { boolean, object, string } from 'zod';

import type { Env } from '../../../types';

type ExtensionRequest = {
  id: string;
  type: 'add' | 'remove';
  accessToken: string;
  isMainnet: boolean;
};

const validationSchema = object({
  id: string().uuid(),
  type: string().regex(/^(add|remove)$/),
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

  const { id, type, accessToken, isMainnet } = body as ExtensionRequest;

  try {
    const isAuthenticated = await validateLensAccount(accessToken, isMainnet);
    if (!isAuthenticated) {
      return new Response(
        JSON.stringify({ success: false, error: Errors.InvalidAccesstoken })
      );
    }

    const { payload } = jwt.decode(accessToken);

    if (!adminAddresses.includes(payload.id)) {
      return new Response(
        JSON.stringify({ success: false, error: Errors.NotAStaff })
      );
    }

    const client = new Client(env.DB_URL);
    await client.connect();

    const query = {
      text: `
        UPDATE communities
        SET staffpicked_at = $1
        WHERE id = $2
        RETURNING *;
      `,
      values: [type === 'add' ? new Date() : null, id]
    };

    const result = await client.query(query);

    return new Response(JSON.stringify(result.rows[0]));
  } catch (error) {
    throw error;
  }
};
