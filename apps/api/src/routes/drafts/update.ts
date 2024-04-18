import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import parseJwt from '@hey/lib/parseJwt';
import catchedError from 'src/lib/catchedError';
import validateLensAccount from 'src/lib/middlewares/validateLensAccount';
import prisma from 'src/lib/prisma';
import { invalidBody, noBody, notAllowed } from 'src/lib/responses';
import { object, string } from 'zod';

type ExtensionRequest = {
  collectModule: null | string;
  content: string;
  id: null | string;
};

const validationSchema = object({
  collectModule: string().nullable(),
  content: string().min(1).max(100000)
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

  const { collectModule, content, id } = body as ExtensionRequest;

  try {
    const payload = parseJwt(accessToken);

    const baseData = {
      ...(collectModule && { collectModule }),
      content
    };

    if (id) {
      const result = await prisma.draftPublication.update({
        data: baseData,
        where: { id: id as string }
      });

      logger.info(`Draft updated for ${payload.id} - ${result.id}`);

      return res.status(200).json({ result, success: true });
    } else {
      const result = await prisma.draftPublication.create({
        data: { profileId: payload.id, ...baseData }
      });

      logger.info(`Draft created for ${payload.id} - ${result.id}`);

      return res.status(200).json({ result, success: true });
    }
  } catch (error) {
    return catchedError(res, error);
  }
};
