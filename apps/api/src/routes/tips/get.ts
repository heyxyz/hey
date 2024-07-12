import type { Request, Response } from 'express';

import logger from '@hey/helpers/logger';
import catchedError from 'src/helpers/catchedError';
import { rateLimiter } from 'src/helpers/middlewares/rateLimiter';
import prisma from 'src/helpers/prisma';
import { invalidBody, noBody } from 'src/helpers/responses';
import { array, object, string } from 'zod';

type ExtensionRequest = {
  ids: string[];
};

const validationSchema = object({
  ids: array(string()).min(1).max(500)
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
      const tipCounts = await prisma.tip.groupBy({
        _count: { publicationId: true },
        by: ['publicationId'],
        orderBy: { publicationId: 'asc' },
        where: { publicationId: { in: ids } }
      });

      const result = tipCounts.map(({ _count, publicationId }) => ({
        count: _count.publicationId,
        id: publicationId
      }));

      logger.info(`Fetched tips for ${ids.length} publications`);

      return res.status(200).json({ result, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
