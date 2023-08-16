import { Errors } from '@lenster/data/errors';
import response from '@lenster/lib/response';

import createSupabaseClient from '../helpers/createSupabaseClient';
import type { Env } from '../types';

export default async (id: string, env: Env) => {
  if (!id) {
    return response({ success: false, error: Errors.NoBody });
  }

  try {
    const client = createSupabaseClient(env);

    const { data } = await client
      .from('rights')
      .select('*')
      .eq('id', id)
      .single();

    return response({
      success: true,
      result: data
        ? {
            id: data.id,
            isStaff: data.is_staff,
            isGardener: data.is_gardener,
            isTrustedMember: data.is_trusted_member,
            staffMode: data.staff_mode,
            gardenerMode: data.gardener_mode
          }
        : null
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
