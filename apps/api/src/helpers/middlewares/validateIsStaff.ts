import type { Request } from 'express';

import parseJwt from '@good/helpers/parseJwt';
import goodPg from 'src/db/goodPg';

import { STAFF_FEATURE_ID } from '../constants';
import validateLensAccount from './validateLensAccount';

/**
 * Middleware to validate if the profile is staff
 * @param request Incoming request
 * @returns Response
 */
const validateIsStaff = async (request: Request) => {
  const validateLensAccountStatus = await validateLensAccount(request);
  if (validateLensAccountStatus !== 200) {
    return validateLensAccountStatus;
  }

  const identityToken = request.headers['x-identity-token'] as string;
  if (!identityToken) {
    return 400;
  }

  try {
    const payload = parseJwt(identityToken);
    const data = await goodPg.query(
      `
        SELECT enabled
        FROM "ProfileFeature"
        WHERE enabled = TRUE
        AND "featureId" = $1
        AND "profileId" = $2
        LIMIT 1;
      `,
      [STAFF_FEATURE_ID, payload.id]
    );

    if (data[0]?.enabled) {
      return 200;
    }

    return 401;
  } catch {
    return 500;
  }
};

export default validateIsStaff;
