import type { Request, Response } from 'express';

import { delRedis } from '@hey/db/redisClient';
import logger from '@hey/helpers/logger';
import parseJwt from '@hey/helpers/parseJwt';
import catchedError from 'src/helpers/catchedError';
import { rateLimiter } from 'src/helpers/middlewares/rateLimiter';
import validateLensAccount from 'src/helpers/middlewares/validateLensAccount';
import prisma from 'src/helpers/prisma';
import { invalidBody, noBody } from 'src/helpers/responses';
import { boolean, object, string } from 'zod';

type ExtensionRequest = {
  id: string;
  pin: boolean;
};

const validationSchema = object({
  id: string(),
  pin: boolean()
});

export const post = [
  rateLimiter({ requests: 10, within: 1 }),
  validateLensAccount,
  async (req: Request, res: Response) => {
    const { body } = req;

    if (!body) {
      return noBody(res);
    }

    const validation = validationSchema.safeParse(body);

    if (!validation.success) {
      return invalidBody(res);
    }

    const { id, pin } = body as ExtensionRequest;

    try {
      const identityToken = req.headers['x-identity-token'] as string;
      const payload = parseJwt(identityToken);

      if (pin) {
        await prisma.pinnedPublication.upsert({
          create: { id: payload.id, publicationId: id },
          update: { id: payload.id, publicationId: id },
          where: { id: payload.id }
        });
      } else {
        await prisma.pinnedPublication.delete({ where: { id: payload.id } });
      }

      await delRedis(`profile:${payload.id}`);
      logger.info(`Publication ${id} ${pin ? 'pinned' : 'unpinned'}`);

      return res.status(200).json({ id, pin, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
