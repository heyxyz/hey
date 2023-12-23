import type { Handler } from 'express';

import parseJwt from '@hey/lib/parseJwt';
import catchedError from '@utils/catchedError';
import validateLensAccount from '@utils/middlewares/validateLensAccount';
import prisma from '@utils/prisma';
import { notAllowed } from '@utils/responses';

export const get: Handler = async (req, res) => {
  const accessToken = req.headers['x-access-token'] as string;

  if (!(await validateLensAccount(req))) {
    return notAllowed(res);
  }

  try {
    const payload = parseJwt(accessToken);
    const profile_id = payload.id;

    const data = await prisma.chatProfiles.findFirst({
      where: {
        profileId: profile_id
      }
    });
    if (data) {
      return res
        .status(200)
        .json({ chatPassword: data.chatPassword, success: true });
    }
    return res.status(200).json({ createProfile: true, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
