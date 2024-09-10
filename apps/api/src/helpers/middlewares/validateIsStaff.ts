import type { NextFunction, Request, Response } from 'express';

import { APP_NAME } from '@hey/data/constants';
import { Errors } from '@hey/data/errors';
import { FeatureFlag } from '@hey/data/feature-flags';
import parseJwt from '@hey/helpers/parseJwt';
import axios from 'axios';

import catchedError from '../catchedError';
import { FLAGS_API_URL, HEY_USER_AGENT } from '../constants';

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

    const { data } = await axios.get(FLAGS_API_URL, {
      headers: {
        Authorization: APP_NAME,
        'User-Agent': HEY_USER_AGENT
      },
      params: {
        appName: 'production',
        environment: 'default',
        userId: payload.id
      }
    });

    const flags = data.toggles;
    const staffToggle = flags.find(
      (toggle: any) => toggle.name === FeatureFlag.Staff
    );

    if (staffToggle?.enabled && staffToggle?.variant?.featureEnabled) {
      return next();
    }

    return catchedError(res, new Error(Errors.Unauthorized), 401);
  } catch {
    return catchedError(res, new Error(Errors.SomethingWentWrong));
  }
};

export default validateIsStaff;
