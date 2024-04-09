import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import parseJwt from '@hey/lib/parseJwt';
import catchedError from 'src/lib/catchedError';
import validateLensAccount from 'src/lib/middlewares/validateLensAccount';
import prisma from 'src/lib/prisma';
import { invalidBody, noBody, notAllowed } from 'src/lib/responses';
import { v4 as uuid } from 'uuid';
import { object, string } from 'zod';

type ExtensionRequest = {
  email: string;
};

const validationSchema = object({
  email: string().email()
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

  const { email } = body as ExtensionRequest;

  try {
    const payload = parseJwt(accessToken);

    const data = await prisma.email.findUnique({
      where: { id: payload.id }
    });

    if (data?.email === email) {
      return res.status(200).json({ success: false });
    }

    const baseData = {
      email,
      tokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      verificationToken: uuid()
    };

    const result = await prisma.email.upsert({
      create: { id: payload.id, ...baseData },
      select: { email: true, id: true, verified: true },
      update: { ...baseData },
      where: { id: payload.id }
    });

    logger.info(`Email updated to ${email} for ${payload.id}`);

    return res.status(200).json({ result, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
