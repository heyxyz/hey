import parseJwt from '@hey/lib/parseJwt';
import createSupabaseClient from '@utils/createSupabaseClient';
import type { NextApiRequest } from 'next';

import { STAFF_FEATURE_ID } from '../constants';
import validateLensAccount from './validateLensAccount';

/**
 * Middleware to validate if the user is staff
 * @param request Incoming worker request
 * @returns Response
 */
const validateIsStaff = async (request: NextApiRequest) => {
  if (!(await validateLensAccount(request))) {
    return false;
  }

  const accessToken = request.headers['x-access-token'] as string;

  if (!accessToken) {
    return false;
  }

  const payload = parseJwt(accessToken);
  const client = createSupabaseClient();

  const { data, error } = await client
    .from('profile-features')
    .select('profile_id, enabled')
    .eq('profile_id', payload.id)
    .eq('feature_id', STAFF_FEATURE_ID)
    .eq('enabled', true)
    .single();

  if (error) {
    return false;
  }

  if (data.enabled) {
    return true;
  }

  return false;
};

export default validateIsStaff;
