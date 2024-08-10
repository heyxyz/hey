import type { Request, Response } from 'express';

import logger from '@hey/helpers/logger';
import catchedError from 'src/helpers/catchedError';
import { rateLimiter } from 'src/helpers/middlewares/rateLimiter';
import { noBody } from 'src/helpers/responses';

export const get = [
  rateLimiter({ requests: 250, within: 1 }),
  (req: Request, res: Response) => {
    const { id } = req.query;

    if (!id) {
      return noBody(res);
    }

    try {
      logger.info('Fetched profile impression stats');

      return res.status(200).json({ impressions: 'wip' });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
