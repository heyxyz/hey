import type { NextFunction, Request, Response } from 'express';

import { Errors } from '@hey/data';
import parseJwt from '@hey/helpers/parseJwt';

import catchedError from '../catchedError';
import prisma from '../prisma';

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

    const data = await prisma.profileFeature.findFirst({
      include: { feature: { select: { key: true } } },
      where: { enabled: true, profileId: payload.id }
    });

    if (data?.enabled) {
      return next();
    }

    return catchedError(res, new Error(Errors.Unauthorized), 401);
  } catch {
    return catchedError(res, new Error(Errors.SomethingWentWrong));
  }
};

export default validateIsStaff;
