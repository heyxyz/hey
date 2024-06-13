import type { Handler } from 'express';

import logger from '@good/helpers/logger';
import parseJwt from '@good/helpers/parseJwt';
import catchedError from 'src/helpers/catchedError';
import prisma from 'src/helpers/prisma';
import { invalidBody, noBody } from 'src/helpers/responses';
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

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return invalidBody(res);
  }

  const { ids } = body as ExtensionRequest;

  try {
    const identityToken = req.headers['x-identity-token'] as string;
    const payload = parseJwt(identityToken);
    const profileId = payload.id;

    const [hasTipped, tipCounts] = await prisma.$transaction([
      prisma.tip.findMany({
        select: { publicationId: true },
        where: {
          fromProfileId: profileId,
          publicationId: { in: ids }
        }
      }),
      prisma.tip.groupBy({
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
