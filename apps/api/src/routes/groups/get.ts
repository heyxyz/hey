import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import allGroupFields from 'src/lib/groups/allGroupFields';
import prisma from 'src/lib/prisma';
import { noBody } from 'src/lib/responses';

export const get: Handler = async (req, res) => {
  const { slug, viewer } = req.query;

  if (!slug) {
    return noBody(res);
  }

  try {
    const [group, count] = await prisma.$transaction([
      prisma.group.findUnique({
        select: {
          ...allGroupFields,
          _count: {
            select: {
              favorites: { where: { profileId: viewer as string } },
              members: { where: { profileId: viewer as string } }
            }
          }
        },
        where: { slug: slug as string }
      }),
      prisma.groupMember.count({ where: { group: { slug: slug as string } } })
    ]);

    if (!group) {
      return res.status(200).json({ error: 'Group not found', success: false });
    }

    const groupWithoutCount = { ...group, _count: undefined };

    const result = {
      ...groupWithoutCount,
      hasFavorited: group._count.favorites > 0,
      isMember: group._count.members > 0,
      members: count
    };

    logger.info(`Group ${slug} was fetched by ${viewer || 'anonymous'}`);

    return res.status(200).json({ result, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
