import type { NextFunction, Request, Response } from "express";

import { Errors } from "@hey/data/errors";

import catchedError from "../catchedError";

/**
 * Middleware to validate secret
 * @param req Incoming request
 * @param res Response
 * @param next Next function
 */
const validateSecret = (req: Request, res: Response, next: NextFunction) => {
  const { secret } = req.query;

  try {
    if (secret === process.env.SECRET) {
      return next();
    }

    return catchedError(res, new Error(Errors.Unauthorized), 401);
  } catch {
    return catchedError(res, new Error(Errors.SomethingWentWrong));
  }
};

export default validateSecret;
