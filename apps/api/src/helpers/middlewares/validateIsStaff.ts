import type { Request } from 'express';

import parseJwt from '@hey/helpers/parseJwt';
import prisma from 'src/helpers/prisma';

import { STAFF_FEATURE_ID } from '../constants';
import validateLensAccount from './validateLensAccount';

/**
 * Middleware to validate if the profile is staff
 * @param request Incoming request
 * @returns Response
 */
const validateIsStaff = async (request: Request) => {
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
        featureId: STAFF_FEATURE_ID,
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

export default validateIsStaff;
