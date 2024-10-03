import { Errors } from "@hey/data/errors";
import prisma from "@hey/db/prisma/db/client";
import parseJwt from "@hey/helpers/parseJwt";
import type { NextFunction, Request, Response } from "express";
import catchedError from "../catchedError";

/**
 * Middleware to validate if the profile is pro
 * @param req Incoming request
 * @param res Response
 * @param next Next function
 */
const validateIsPro = async (
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

    const data = await prisma.pro.findFirst({
      where: { profileId: payload.id, expiresAt: { gt: new Date() } },
      orderBy: { expiresAt: "desc" }
    });

    if (data?.id) {
      return next();
    }

    return catchedError(res, new Error(Errors.Unauthorized), 401);
  } catch {
    return catchedError(res, new Error(Errors.SomethingWentWrong));
  }
};

export default validateIsPro;
