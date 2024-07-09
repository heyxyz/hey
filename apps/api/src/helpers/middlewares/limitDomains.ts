import type { NextFunction, Request, Response } from 'express';

import { Errors } from '@hey/data';
import logger from '@hey/helpers/logger';

import catchedError from '../catchedError';

const allowedDomains = [
  'https://hey.xyz',
  'https://testnet.hey.xyz',
  'https://staging.hey.xyz',
  'http://localhost:4783'
];

const pathsToSkip = ['/health', '/meta', '/sitemap'];

const limitDomains = (req: Request, res: Response, next: NextFunction) => {
  // Check if the path should be skipped
  if (pathsToSkip.includes(req.path)) {
    return next();
  }

  const origin = req.headers.origin || req.headers.referer;

  if (!origin || !allowedDomains.includes(origin)) {
    logger.error(`Origin not allowed - ${origin}`);
    return catchedError(res, new Error(Errors.Unauthorized), 401);
  }

  next();
};

export default limitDomains;
