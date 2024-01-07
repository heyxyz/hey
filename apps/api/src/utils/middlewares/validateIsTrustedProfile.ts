import type { Request } from 'express';

import parseJwt from '@hey/lib/parseJwt';
import prisma from '@utils/prisma';

import validateLensAccount from './validateLensAccount';

/**
 * Middleware to validate if the profile is trusted
 * @param request Incoming request
 * @returns Response
 */
const validateIsTrustedProfile = async (request: Request) => {
  if (!(await validateLensAccount(request))) {
    return false;
  }

  try {
    const accessToken = request.headers['x-access-token'] as string;

    if (!accessToken) {
      return false;
    }

    const payload = parseJwt(accessToken);
    const data = await prisma.trustedProfile.findFirst({
      where: { id: payload.id }
    });

    if (data?.id) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
};

export default validateIsTrustedProfile;
