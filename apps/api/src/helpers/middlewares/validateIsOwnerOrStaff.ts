import type { Request } from 'express';

import parseJwt from '@good/helpers/parseJwt';

import validateIsStaff from './validateIsStaff';

/**
 * Middleware to validate if the profile is staff or the owner of the profile
 * @param request Incoming request
 * @param id Profile id
 * @returns Response
 */
const validateIsOwnerOrStaff = async (request: Request, id: string) => {
  // Add validateLensAccount middleware to validate the access token

  const accessToken = request.headers['x-access-token'] as string;

  if (!accessToken) {
    return 400;
  }

  try {
    const payload = parseJwt(accessToken);

    // Check if the profile is staff or the owner of the profile
    const validateIsStaffStatus = await validateIsStaff(request);
    if (payload.id !== id && validateIsStaffStatus !== 200) {
      return 401;
    }

    return 200;
  } catch {
    return 500;
  }
};

export default validateIsOwnerOrStaff;
