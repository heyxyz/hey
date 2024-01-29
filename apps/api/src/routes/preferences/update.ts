import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import parseJwt from '@hey/lib/parseJwt';
import catchedError from 'src/lib/catchedError';
import validateLensAccount from 'src/lib/middlewares/validateLensAccount';
import prisma from 'src/lib/prisma';
import { invalidBody, noBody, notAllowed } from 'src/lib/responses';
import { boolean, object, string } from 'zod';

type ExtensionRequest = {
  highSignalNotificationFilter?: boolean;
  id?: string;
  isPride?: boolean;
};

const validationSchema = object({
  highSignalNotificationFilter: boolean().optional(),
  id: string().optional(),
  isPride: boolean().optional()
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

  const { highSignalNotificationFilter, isPride } = body as ExtensionRequest;

  try {
    const payload = parseJwt(accessToken);

    const data = await prisma.preference.upsert({
      create: { highSignalNotificationFilter, id: payload.id, isPride },
      update: { highSignalNotificationFilter, isPride },
      where: { id: payload.id }
    });

    logger.info(`Updated preferences for ${payload.id}`);

    return res.status(200).json({ result: data, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
