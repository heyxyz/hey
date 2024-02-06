import type { Handler } from 'express';

import { Regex } from '@hey/data/regex';
import logger from '@hey/lib/logger';
import parseJwt from '@hey/lib/parseJwt';
import catchedError from 'src/lib/catchedError';
import validateLensAccount from 'src/lib/middlewares/validateLensAccount';
import prisma from 'src/lib/prisma';
import { invalidBody, noBody, notAllowed } from 'src/lib/responses';
import { object, string } from 'zod';

type ExtensionRequest = {
  avatar: string;
  description: string;
  discord?: string;
  instagram?: string;
  lens?: string;
  name: string;
  slug: string;
  x?: string;
};

const validationSchema = object({
  avatar: string().min(1).max(100),
  description: string().max(5000),
  discord: string().max(50).regex(Regex.url).optional(),
  instagram: string().max(32).regex(Regex.handle).optional(),
  lens: string().max(32).regex(Regex.handle).optional(),
  name: string().min(1).max(50),
  slug: string().min(1).max(32).regex(Regex.handle),
  x: string().max(32).regex(Regex.handle).optional()
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

  // if (!(await validateIsStaff(req))) {
  //   return notAllowed(res);
  // }

  const { avatar, description, discord, instagram, lens, name, slug, x } =
    body as ExtensionRequest;

  try {
    const payload = parseJwt(accessToken);

    const group = await prisma.group.create({
      data: {
        avatar,
        creatorId: payload.id,
        description,
        discord,
        favorites: { create: { profileId: payload.id } },
        instagram,
        lens,
        members: { create: { profileId: payload.id } },
        name,
        slug,
        tags: [slug],
        x
      }
    });
    logger.info(`Created a group ${group.id}`);

    return res.status(200).json({ group, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
