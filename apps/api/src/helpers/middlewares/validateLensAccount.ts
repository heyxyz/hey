import { Errors } from "@hey/data/errors";
import lensPg from "@hey/db/lensPg";
import { getRedis, setRedis } from "@hey/db/redisClient";
import parseJwt from "@hey/helpers/parseJwt";
import type { NextFunction, Request, Response } from "express";
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
  const idToken = req.headers["x-id-token"] as string;
  if (!idToken) {
    return catchedError(res, new Error(Errors.Unauthorized), 401);
  }

  try {
    const payload = parseJwt(idToken);
    const cacheKey = `auth:${payload.id}`;
    const cachedData = await getRedis(cacheKey);

    if (cachedData) {
      return next();
    }

    const authentication = await lensPg.query(
      `
        SELECT EXISTS (
          SELECT 1 FROM authentication.record
          WHERE profile_id = $1
          AND authorization_id = $2
          LIMIT 1
        ) AS exists;
      `,
      [payload.id, payload.authenticationId]
    );

    if (authentication[0]?.exists) {
      await setRedis(cacheKey, payload.authenticationId);
      return next();
    }

    return catchedError(res, new Error(Errors.Unauthorized), 401);
  } catch {
    return catchedError(res, new Error(Errors.SomethingWentWrong));
  }
};

export default validateLensAccount;
