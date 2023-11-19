import parseJwt from '@hey/lib/parseJwt';
import prisma from '@utils/prisma';
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

  try {
    const accessToken = request.headers['x-access-token'] as string;

    if (!accessToken) {
      return false;
    }

    const payload = parseJwt(accessToken);
    const data = await prisma.profileFeature.findFirst({
      where: {
        profileId: payload.id,
        featureId: STAFF_FEATURE_ID,
        enabled: true
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
