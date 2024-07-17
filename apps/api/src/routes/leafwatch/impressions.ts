import type { Request, Response } from 'express';

import logger from '@hey/helpers/logger';
import catchedError from 'src/helpers/catchedError';
import { rateLimiter } from 'src/helpers/middlewares/rateLimiter';
import { rPush } from 'src/helpers/redisClient';
import { invalidBody, noBody } from 'src/helpers/responses';
import { array, object, string } from 'zod';

type ExtensionRequest = {
  ids: string[];
};

const validationSchema = object({
  ids: array(string())
});

export const post = [
  rateLimiter({ requests: 50, within: 1 }),
  async (req: Request, res: Response) => {
    const { body } = req;

    if (!body) {
      return noBody(res);
    }

    const validation = validationSchema.safeParse(body);

    if (!validation.success) {
      return invalidBody(res);
    }

    const { ids } = body as ExtensionRequest;

    try {
      const values = ids.map((id) => ({
        publication: id,
        viewed: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }));

      await rPush('impressions', JSON.stringify(values));
      logger.info(`Ingested ${values.length} impressions to Leafwatch`);

      return res.status(200).json({ success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
