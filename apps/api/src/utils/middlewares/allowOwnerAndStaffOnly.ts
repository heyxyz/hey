import parseJwt from '@hey/lib/parseJwt';
import type { Request } from 'express';

import validateIsStaff from './validateIsStaff';
import validateLensAccount from './validateLensAccount';

/**
 * Middleware to validate Lens access token
 * @param request Incoming request
 * @returns Response
 */
const allowOwnerAndStaffOnly = async (request: Request, id: string) => {
  const accessToken = request.headers['x-access-token'] as string;

  if (!accessToken) {
    return false;
  }

  try {
    const payload = parseJwt(accessToken);

    if (!(await validateLensAccount(request))) {
      return false;
    }

    // Check if the user is staff or the owner of the profile
    if (payload.id !== id && !(await validateIsStaff(request))) {
      return false;
    }
  } catch {
    return false;
  }
};

export default allowOwnerAndStaffOnly;
