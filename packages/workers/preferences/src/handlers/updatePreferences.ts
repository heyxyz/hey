import { Errors } from '@lenster/data/errors';
import { Regex } from '@lenster/data/regex';
import { adminAddresses } from '@lenster/data/staffs';
import response from '@lenster/lib/response';
import validateLensAccount from '@lenster/lib/validateLensAccount';
import jwt from '@tsndr/cloudflare-worker-jwt';
import type { IRequest } from 'itty-router';
import { boolean, object, string } from 'zod';

import createSupabaseClient from '../helpers/createSupabaseClient';
import type { Env } from '../types';

type ExtensionRequest = {
  id: string;
  isStaff?: boolean;
  isGardener?: boolean;
  isTrustedMember?: boolean;
  isVerified?: boolean;
  accessToken: string;
};

const validationSchema = object({
  id: string(),
  isStaff: boolean().optional(),
  isGardener: boolean().optional(),
  isTrustedMember: boolean().optional(),
  isVerified: boolean().optional(),
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

  const { id, isGardener, isStaff, isTrustedMember, isVerified, accessToken } =
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

    const client = createSupabaseClient(env);

    const { data, error } = await client
      .from('rights')
      .upsert({
        id,
        is_staff: isStaff,
        is_gardener: isGardener,
        is_trusted_member: isTrustedMember,
        is_verified: isVerified
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Clear cache in Cloudflare KV
    await env.ACCESS.delete('verified-list');

    return response({ success: true, result: data });
  } catch (error) {
    throw error;
  }
};
