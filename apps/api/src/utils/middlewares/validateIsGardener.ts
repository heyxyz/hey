import parseJwt from '@hey/lib/parseJwt';
import prisma from '@utils/prisma';
import type { Request } from 'express';

import { GARDENER_FEATURE_ID } from '../constants';
import validateLensAccount from './validateLensAccount';

/**
 * Middleware to validate if the user is gardener
 * @param request Incoming worker request
 * @returns Response
 */
const validateIsGardener = async (request: Request) => {
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
        featureId: GARDENER_FEATURE_ID,
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

export default validateIsGardener;
