import type { NextFunction, Request, Response } from 'express';

import { Errors } from '@hey/data';
import heyPg from '@hey/db/heyPg';
import parseJwt from '@hey/helpers/parseJwt';

import catchedError from '../catchedError';
import { STAFF_FEATURE_ID } from '../constants';

/**
 * Middleware to validate if the profile is staff
 * @param req Incoming request
 * @param res Response
 * @param next Next function
 */
const validateIsStaff = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const identityToken = req.headers['x-identity-token'] as string;
  if (!identityToken) {
    return catchedError(res, new Error(Errors.Unauthorized), 401);
  }

  try {
    const payload = parseJwt(identityToken);
    const data = await heyPg.query(
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
      return next();
    }

    return catchedError(res, new Error(Errors.Unauthorized), 401);
  } catch {
    return catchedError(res, new Error(Errors.SomethingWentWrong));
  }
};

export default validateIsStaff;
