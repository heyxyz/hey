import response from '@lenster/lib/response';
import createSupabaseClient from '@lenster/supabase/createSupabaseClient';

import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  const profileId = request.query.profileId as string;
  const channelId = request.query.channelId as string;

  try {
    const client = createSupabaseClient(request.env.SUPABASE_KEY);
    const { data } = await client
      .from('channel_memberships')
      .select('*')
      .eq('profile_id', profileId)
      .eq('channel_id', channelId)
      .single();

    return response({ success: true, isMember: data ? true : false });
  } catch (error) {
    throw error;
  }
};
