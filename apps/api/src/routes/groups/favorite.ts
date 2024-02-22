import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import parseJwt from '@hey/lib/parseJwt';
import catchedError from 'src/lib/catchedError';
import validateLensAccount from 'src/lib/middlewares/validateLensAccount';
import prisma from 'src/lib/prisma';
import { invalidBody, noBody, notAllowed } from 'src/lib/responses';
import { object, string } from 'zod';

type ExtensionRequest = {
  id: string;
};

const validationSchema = object({
  id: string().uuid()
});

// TODO: add tests
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

  if (!(await validateLensAccount(req))) {
    return notAllowed(res);
  }

  const { id } = body as ExtensionRequest;

  try {
    const payload = parseJwt(accessToken);

    const isMember = await prisma.groupMember.findFirst({
      where: { groupId: id, profileId: payload.id }
    });

    if (!isMember) {
      return res
        .status(200)
        .json({ result: 'User is not a member of the group.', success: false });
    }

    const initData = { groupId: id, profileId: payload.id };
    const data = await prisma.groupFavorite.upsert({
      create: initData,
      update: { createdAt: new Date() },
      where: { groupId_profileId: initData }
    });

    logger.info(`User favorited the group ${id}`);

    return res.status(200).json({ result: data, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
