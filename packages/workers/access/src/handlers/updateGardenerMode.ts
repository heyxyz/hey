import { Errors } from '@lenster/data/errors';
import { Regex } from '@lenster/data/regex';
import hasOwnedLensProfiles from '@lenster/lib/hasOwnedLensProfiles';
import response from '@lenster/lib/response';
import validateLensAccount from '@lenster/lib/validateLensAccount';
import jwt from '@tsndr/cloudflare-worker-jwt';
import type { IRequest } from 'itty-router';
import { boolean, object, string } from 'zod';

import type { Env } from '../types';

type ExtensionRequest = {
  id: string;
  enabled: boolean;
  accessToken: string;
};

const validationSchema = object({
  id: string(),
  enabled: boolean(),
  accessToken: string().regex(Regex.accessToken)
});

export default async (request: IRequest, env: Env) => {
  const body = await request.json();
  if (!body) {
    return response({ success: false, error: Errors.NoBody });
  }

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return response({ success: false, error: validation.error.issues });
  }

  const { id, enabled, accessToken } = body as ExtensionRequest;

  try {
    const isAuthenticated = await validateLensAccount(accessToken, true);
    if (!isAuthenticated) {
      return response({ success: false, error: Errors.InvalidAccesstoken });
    }

    const { payload } = jwt.decode(accessToken);
    const hasOwned = await hasOwnedLensProfiles(payload.id, id, true);
    if (!hasOwned) {
      return new Response(
        JSON.stringify({ success: false, error: Errors.InvalidProfileId })
      );
    }

    const clickhouseResponse = await fetch(
      `${env.CLICKHOUSE_REST_ENDPOINT}&default_format=JSONCompact`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: `SELECT is_gardener FROM rights WHERE id = '${id}';`
      }
    );

    if (clickhouseResponse.status !== 200) {
      return response({ success: false, error: Errors.StatusCodeIsNot200 });
    }

    const json: { data: any[] } = await clickhouseResponse.json();

    // Check if the user is_gardener
    if (json.data.length && json.data[0][0]) {
      const updateResponse = await fetch(
        `${env.CLICKHOUSE_REST_ENDPOINT}&default_format=JSONCompact`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: `
            ALTER TABLE rights
            UPDATE gardener_mode = ${enabled}
            WHERE id = '${id}';
          `
        }
      );

      if (updateResponse.status !== 200) {
        return response({ success: false, error: Errors.StatusCodeIsNot200 });
      }

      return response({ success: true, enabled });
    }

    return response({ success: true });
  } catch (error) {
    throw error;
  }
};
