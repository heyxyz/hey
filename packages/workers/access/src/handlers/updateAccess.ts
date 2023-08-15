import { Errors } from '@lenster/data/errors';
import { Regex } from '@lenster/data/regex';
import { adminAddresses } from '@lenster/data/staffs';
import response from '@lenster/lib/response';
import validateLensAccount from '@lenster/lib/validateLensAccount';
import jwt from '@tsndr/cloudflare-worker-jwt';
import type { IRequest } from 'itty-router';
import { boolean, object, string } from 'zod';

import type { Env } from '../types';

type ExtensionRequest = {
  id: string;
  isStaff?: boolean;
  isGardener?: boolean;
  isTrustedMember?: boolean;
  accessToken: string;
};

const validationSchema = object({
  id: string(),
  isStaff: boolean().optional(),
  isGardener: boolean().optional(),
  isTrustedMember: boolean().optional(),
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

  const { id, isGardener, isStaff, isTrustedMember, accessToken } =
    body as ExtensionRequest;

  try {
    const isAuthenticated = await validateLensAccount(accessToken, true);
    if (!isAuthenticated) {
      return response({ success: false, error: Errors.InvalidAccesstoken });
    }

    const { payload } = jwt.decode(accessToken);
    if (!adminAddresses.includes(payload.id)) {
      return response({ success: false, error: Errors.NotAdmin });
    }

    const clickhouseResponse = await fetch(
      `${env.CLICKHOUSE_REST_ENDPOINT}&default_format=JSONCompact`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: `SELECT * FROM rights WHERE id = '${id}';`
      }
    );

    if (clickhouseResponse.status !== 200) {
      return response({ success: false, error: Errors.StatusCodeIsNot200 });
    }

    const json: {
      data: [string, boolean, boolean, boolean][];
    } = await clickhouseResponse.json();

    if (json.data.length) {
      const updateResponse = await fetch(
        `${env.CLICKHOUSE_REST_ENDPOINT}&default_format=JSONCompact`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: `
            ALTER TABLE rights
            UPDATE
              is_staff = ${isStaff ?? json.data[0][1]},
              is_gardener = ${isGardener ?? json.data[0][2]},
              is_trusted_member = ${isTrustedMember ?? json.data[0][3]}
            WHERE id = '${id}';
          `
        }
      );

      if (updateResponse.status !== 200) {
        return response({ success: false, error: Errors.StatusCodeIsNot200 });
      }

      return response({ success: true });
    } else {
      // insert new record
      const insertResponse = await fetch(
        `${env.CLICKHOUSE_REST_ENDPOINT}&default_format=JSONCompact`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: `
            INSERT INTO rights (id, is_staff, is_gardener, is_trusted_member)
            VALUES (
              '${id}',
              ${isStaff ?? false},
              ${isGardener ?? false},
              ${isTrustedMember ?? false}
            );
          `
        }
      );

      if (insertResponse.status !== 200) {
        return response({ success: false, error: Errors.StatusCodeIsNot200 });
      }

      return response({ success: true });
    }
  } catch (error) {
    throw error;
  }
};
