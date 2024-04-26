import type { Request } from 'express';

import parseJwt from '@hey/helpers/parseJwt';
import prisma from 'src/helpers/prisma';

import validateLensAccount from './validateLensAccount';

/**
 * Middleware to validate if the feature is available for the user
 * @param request Incoming request
 * @param id Feature ID
 * @returns Response
 */
const validateFeatureAvailable = async (request: Request, id: string) => {
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
      where: { enabled: true, featureId: id, profileId: payload.id }
    });

    if (data?.enabled) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
};

export default validateFeatureAvailable;
