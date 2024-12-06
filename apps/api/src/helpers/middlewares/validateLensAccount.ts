import { Errors } from "@hey/data/errors";
import type { NextFunction, Request, Response } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";
import catchedError from "../catchedError";

const jwksUri = "https://api.testnet.lens.dev/.well-known/jwks.json";
const JWKS = createRemoteJWKSet(new URL(jwksUri));

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
    await jwtVerify(idToken, JWKS);
    return next();
  } catch {
    return catchedError(res, new Error(Errors.Unauthorized), 401);
  }
};

export default validateLensAccount;
