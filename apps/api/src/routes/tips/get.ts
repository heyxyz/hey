import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import parseJwt from '@hey/lib/parseJwt';
import catchedError from 'src/lib/catchedError';
import heyPrisma from 'src/lib/heyPrisma';
import { invalidBody, noBody } from 'src/lib/responses';
import { array, object, string } from 'zod';

type ExtensionRequest = {
  ids: string[];
};

const validationSchema = object({
  ids: array(string()).min(1).max(500)
});

export const post: Handler = async (req, res) => {
  const { body } = req;

  if (!body) {
    return noBody(res);
  }

  const accessToken = req.headers['x-access-token'] as string;
  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return invalidBody(res);
  }

  const { ids } = body as ExtensionRequest;

  try {
    const payload = parseJwt(accessToken);
    const profileId = payload.id;

    const [hasTipped, tipCounts] = await heyPrisma.$transaction([
      heyPrisma.tip.findMany({
        select: { publicationId: true },
        where: {
          fromProfileId: profileId,
          publicationId: { in: ids }
        }
      }),
      heyPrisma.tip.groupBy({
        _count: { publicationId: true },
        by: ['publicationId'],
        orderBy: { publicationId: 'asc' },
        where: { publicationId: { in: ids } }
      })
    ]);

    const hasTippedMap = new Set(hasTipped.map((tip) => tip.publicationId));

    const result = tipCounts.map(({ _count, publicationId }) => ({
      // @ts-ignore
      count: _count.publicationId,
      id: publicationId,
      tipped: hasTippedMap.has(publicationId)
    }));

    logger.info(`Fetched tips for ${ids.length} publications`);

    return res.status(200).json({ result, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
