import type { NextFunction, Request, Response } from "express";

import { Errors } from "@hey/data/errors";
import lensPg from "@hey/db/lensPg";
import { getRedis, setRedis } from "@hey/db/redisClient";
import parseJwt from "@hey/helpers/parseJwt";

import catchedError from "../catchedError";

/**
 * Middleware to validate Lens account
 * @param req Incoming request
 * @param res Response
 * @param next Next function
 */
const validateLensAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const identityToken = req.headers["x-identity-token"] as string;
  if (!identityToken) {
    return catchedError(res, new Error(Errors.Unauthorized), 401);
  }

  try {
    const payload = parseJwt(identityToken);
    const cacheKey = `auth:${payload.id}`;
    const cachedData = await getRedis(cacheKey);

    if (cachedData) {
      return next();
    }

    const data = await lensPg.query(
      `
        SELECT EXISTS (
          SELECT 1 FROM authentication.record
          WHERE profile_id = $1
          AND authorization_id = $2
          LIMIT 1
        ) AS result;
      `,
      [payload.id, payload.authorizationId]
    );

    if (data[0]?.result) {
      await setRedis(cacheKey, payload.authorizationId);
      return next();
    }

    return catchedError(res, new Error(Errors.Unauthorized), 401);
  } catch {
    return catchedError(res, new Error(Errors.SomethingWentWrong));
  }
};

export default validateLensAccount;
