import type { NextFunction, Request, Response } from "express";

import redisClient from "@hey/db/redisClient";
import getIp from "@hey/helpers/getIp";
import sha256 from "@hey/helpers/sha256";
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";

import catchedError from "../catchedError";

const hashedIp = (req: Request): string => sha256(getIp(req)).slice(0, 25);

const createRateLimiter = (window: number, max: number) => {
  return rateLimit({
    handler: (req, res) =>
      catchedError(
        res,
        new Error(`Too many requests - ${req.path} - ${getIp(req)}`),
        429
      ),
    keyGenerator: (req) => `${sha256(req.path).slice(0, 25)}:${hashedIp(req)}`,
    legacyHeaders: false,
    max, // Maximum number of requests allowed within the window
    skip: () => !redisClient?.isReady,
    standardHeaders: true,
    store: redisClient
      ? new RedisStore({
          prefix: "rate-limit:",
          sendCommand: (...args: string[]) =>
            redisClient?.sendCommand(args) as any
        })
      : undefined,
    windowMs: window * 60 * 1000 // Time window in milliseconds
  });
};

export const rateLimiter = ({
  requests,
  within
}: {
  requests: number;
  within: number;
}) => {
  const rateLimiter = createRateLimiter(within, requests);

  return (req: Request, res: Response, next: NextFunction) => {
    rateLimiter(req, res, next);
  };
};
