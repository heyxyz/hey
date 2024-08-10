import type { Request, Response } from 'express';

import leafwatch from '@hey/db/prisma/leafwatch/client';
import logger from '@hey/helpers/logger';
import catchedError from 'src/helpers/catchedError';
import { rateLimiter } from 'src/helpers/middlewares/rateLimiter';
import { invalidBody, noBody } from 'src/helpers/responses';
import { array, object, string } from 'zod';

type ExtensionRequest = {
  ids: string[];
};

const validationSchema = object({
  ids: array(string().max(2000, { message: 'Too many ids!' }))
});

export const post = [
  rateLimiter({ requests: 250, within: 1 }),
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
      const data = await leafwatch.impression.groupBy({
        _count: { publication: true },
        by: ['publication'],
        orderBy: { _count: { publication: 'desc' } },
        where: { publication: { in: ids } }
      });

      const viewCounts = data.map((impression) => ({
        id: impression.publication,
        views: impression._count.publication
      }));
      logger.info(`Fetched publication views for ${ids.length} publications`);

      return res.status(200).json({ success: true, views: viewCounts });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
