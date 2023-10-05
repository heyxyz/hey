import createSupabaseClient from '@hey/supabase/createSupabaseClient';

import type { WorkerRequest } from '../types';

const checkIsStaffFromDb = async (
  request: WorkerRequest,
  profileId: string
) => {
  const client = createSupabaseClient(request.env.SUPABASE_KEY);

  const { data, error } = await client
    .from('rights')
    .select('id')
    .eq('id', profileId);

  if (error) {
    return false;
  }

  if (!data.length) {
    return false;
  }

  return true;
};

export default checkIsStaffFromDb;
