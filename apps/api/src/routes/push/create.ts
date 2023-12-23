import type { Handler } from 'express';
import type { infer as zInfer } from 'zod';

import parseJwt from '@hey/lib/parseJwt';
import catchedError from '@utils/catchedError';
import validateLensAccount from '@utils/middlewares/validateLensAccount';
import prisma from '@utils/prisma';
import { invalidBody, noBody, notAllowed } from '@utils/responses';
import { object, string } from 'zod';

const validationSchema = object({
  password: string().min(32)
});

type PushRequest = zInfer<typeof validationSchema>;

export const post: Handler = async (req, res) => {
  const accessToken = req.headers['x-access-token'] as string;

  const { body } = req;

  if (!body) {
    return noBody(res);
  }

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return invalidBody(res);
  }

  if (!(await validateLensAccount(req))) {
    return notAllowed(res);
  }

  const { password } = body as PushRequest;

  try {
    const payload = parseJwt(accessToken);
    const profile_id = payload.id;

    const data = await prisma.chatProfiles.findFirst({
      where: {
        profileId: profile_id
      }
    });

    if (data) {
      return res.status(200).json({ success: true });
    }

    await prisma.chatProfiles.create({
      data: {
        chatPassword: password,
        profileId: profile_id
      }
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
