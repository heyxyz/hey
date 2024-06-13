import type { Handler } from 'express';

import logger from '@good/helpers/logger';
import parseJwt from '@good/helpers/parseJwt';
import catchedError from 'src/helpers/catchedError';
import validateLensAccount from 'src/helpers/middlewares/validateLensAccount';
import prisma from 'src/helpers/prisma';
import { invalidBody, noBody, notAllowed } from 'src/helpers/responses';
import { boolean, object, string } from 'zod';

type ExtensionRequest = {
  id: string;
  pin: boolean;
};

const validationSchema = object({
  id: string(),
  pin: boolean()
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

  const validateLensAccountStatus = await validateLensAccount(req);
  if (validateLensAccountStatus !== 200) {
    return notAllowed(res, validateLensAccountStatus);
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

    logger.info(`Publication ${id} ${pin ? 'pinned' : 'unpinned'}`);

    return res.status(200).json({ id, pin, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
