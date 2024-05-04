import type { Request } from 'express';

import parseJwt from '@hey/helpers/parseJwt';
import heyPg from 'src/db/heyPg';

import { GARDENER_FEATURE_ID } from '../constants';
import validateLensAccount from './validateLensAccount';

/**
 * Middleware to validate if the profile is gardener
 * @param request Incoming request
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
    const data = await heyPg.query(
      `
        SELECT enabled
        FROM "ProfileFeature"
        WHERE enabled = TRUE
        AND "featureId" = $1
        AND "profileId" = $2
        LIMIT 1;
      `,
      [GARDENER_FEATURE_ID, payload.id]
    );

    if (data[0]?.enabled) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
};

export default validateIsGardener;
