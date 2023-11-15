import { Errors } from '@hey/data/errors';
import response from '@hey/lib/response';
import createSupabaseClient from '@hey/supabase/createSupabaseClient';
import { boolean, object, string } from 'zod';

import validateIsStaff from '../../helpers/validateIsStaff';
import type { WorkerRequest } from '../../types';

type ExtensionRequest = {
  id: string;
  enabled: boolean;
};

const validationSchema = object({
  id: string(),
  enabled: boolean()
});

export default async (request: WorkerRequest) => {
  const body = await request.json();
  if (!body) {
    return response({ success: false, error: Errors.NoBody });
  }

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return response({ success: false, error: validation.error.issues });
  }

  if (!(await validateIsStaff(request))) {
    return response({ success: false, error: Errors.NotStaff });
  }

  const { id, enabled } = body as ExtensionRequest;

  const clearCache = async () => {
    await request.env.VERIFIED.delete('list');
  };

  try {
    const client = createSupabaseClient(request.env.SUPABASE_KEY);

    if (enabled) {
      const { error: upsertError } = await client
        .from('verified')
        .upsert({ id });

      if (upsertError) {
        throw upsertError;
      }
      await clearCache();

      return response({ success: true, enabled });
    }

    const { error: deleteError } = await client
      .from('verified')
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw deleteError;
    }
    await clearCache();

    return response({ success: true, enabled });
  } catch (error) {
    throw error;
  }
};
