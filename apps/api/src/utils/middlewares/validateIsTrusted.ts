import type { Request } from 'express';

import parseJwt from '@hey/lib/parseJwt';
import { TRUSTED_PROFILE_FEATURE_ID } from '@utils/constants';
import prisma from '@utils/prisma';

import validateLensAccount from './validateLensAccount';

/**
 * Middleware to validate if the profile is trusted
 * @param request Incoming request
 * @returns Response
 */
const validateIsTrusted = async (request: Request) => {
  if (!(await validateLensAccount(request))) {
    return false;
  }

  try {
    const accessToken = request.headers['x-access-token'] as string;

    if (!accessToken) {
      return false;
    }

    const payload = parseJwt(accessToken);
    const data = await prisma.profileFeature.findFirst({
      where: {
        enabled: true,
        featureId: TRUSTED_PROFILE_FEATURE_ID,
        profileId: payload.id
      }
    });

    if (data?.enabled) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
};

export default validateIsTrusted;
