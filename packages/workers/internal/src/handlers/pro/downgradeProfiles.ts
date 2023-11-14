import { Errors } from '@hey/data/errors';
import response from '@hey/lib/response';
import createSupabaseClient from '@hey/supabase/createSupabaseClient';
import { object, string } from 'zod';

import type { WorkerRequest } from '../../types';

type ExtensionRequest = {
  secret: string;
};

const validationSchema = object({
  secret: string()
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

  const { secret } = body as ExtensionRequest;

  if (secret !== request.env.SECRET) {
    return response({ success: false, error: Errors.InvalidSecret });
  }

  try {
    const client = createSupabaseClient(request.env.SUPABASE_KEY);
    const { error } = await client
      .from('pro')
      .delete()
      .lte('expires_at', new Date().toISOString());

    if (error) {
      throw error;
    }

    return response({ success: true });
  } catch (error) {
    throw error;
  }
};
