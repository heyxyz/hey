import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import allGroupFields from 'src/lib/groups/allGroupFields';
import prisma from 'src/lib/prisma';

export const get: Handler = async (req, res) => {
  const { favorites, featured, joined, limit, offset, viewer } = req.query;

  const limitNumber = limit ? parseInt(limit as string) : 10;
  const offsetNumber = offset ? parseInt(offset as string) : 0;

  // If joined or favorites is true, viewer must be defined
  if (
    (joined || favorites) &&
    (typeof viewer === 'undefined' || viewer === '')
  ) {
    return res.status(400).json({
      error: 'Viewer must be defined when joined or favorites is true',
      success: false
    });
  }

  try {
    const data = await prisma.group.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        _count: {
          select: {
            favorites: { where: { profileId: viewer as string } },
            members: { where: { profileId: viewer as string } }
          }
        },
        ...allGroupFields
      },
      skip: offsetNumber,
      take: limitNumber,
      where: {
        ...(favorites
          ? { favorites: { some: { profileId: viewer as string } } }
          : {}),
        ...(featured ? { featured: true } : {}),
        ...(joined
          ? { members: { some: { profileId: viewer as string } } }
          : {})
      }
    });

    const memberships = await prisma.groupMember.findMany({
      where: {
        AND: [
          { profileId: viewer as string },
          { groupId: { in: data.map((group) => group.id) } }
        ]
      }
    });

    let idIsMember: { [key: string]: boolean } = {};
    for (const item of memberships) {
      idIsMember[item.groupId] = item.profileId === viewer;
    }

    const result = {
      groups: data.map((group) => {
        const groupWithoutCount = { ...group, _count: undefined };

        return {
          ...groupWithoutCount,
          ...{
            hasFavorited: group._count.favorites > 0,
            isMember: idIsMember[group.id] || false,
            members: group._count.members
          }
        };
      })
    };

    logger.info(`Featured all groups of ${viewer}`);

    return res.status(200).json({ result, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
