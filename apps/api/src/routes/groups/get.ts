import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import prisma from 'src/lib/prisma';
import { noBody } from 'src/lib/responses';

export const get: Handler = async (req, res) => {
  const { slug, viewer } = req.query;

  if (!slug) {
    return noBody(res);
  }

  try {
    const [group, count, membership] = await prisma.$transaction([
      prisma.group.findUnique({ where: { slug: slug as string } }),
      prisma.groupMember.count({ where: { group: { slug: slug as string } } }),
      prisma.groupMember.findFirst({
        where: {
          AND: [
            { group: { slug: slug as string } },
            { profileId: viewer as string }
          ]
        }
      })
    ]);

    const result = {
      ...group,
      isMember: membership?.profileId === viewer,
      members: count
    };

    logger.info(`Group ${slug} was fetched by ${viewer || 'anonymous'}`);

    return res.status(200).json({ result, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
