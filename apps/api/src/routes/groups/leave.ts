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

    const initData = { groupId: id, profileId: payload.id };
    await prisma.groupMember.delete({
      where: { groupId_profileId: initData }
    });

    logger.info(`User left group ${id}`);

    return res.status(200).json({ success: true });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res
        .status(200)
        .json({ result: 'User is not a member of the group.', success: false });
    }

    return catchedError(res, error);
  }
};
