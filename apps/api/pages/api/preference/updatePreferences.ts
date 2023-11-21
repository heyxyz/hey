import { Errors } from '@hey/data/errors';
import parseJwt from '@hey/lib/parseJwt';
import allowCors from '@utils/allowCors';
import createRedisClient from '@utils/createRedisClient';
import validateLensAccount from '@utils/middlewares/validateLensAccount';
import prisma from '@utils/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { boolean, object, string } from 'zod';

type ExtensionRequest = {
  id?: string;
  isPride?: boolean;
  highSignalNotificationFilter?: boolean;
};

const validationSchema = object({
  id: string().optional(),
  isPride: boolean().optional(),
  highSignalNotificationFilter: boolean().optional()
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;

  if (!body) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  const accessToken = req.headers['x-access-token'] as string;
  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return res.status(400).json({ success: false, error: Errors.InvalidBody });
  }

  if (!(await validateLensAccount(req))) {
    return res
      .status(400)
      .json({ success: false, error: Errors.InvalidAccesstoken });
  }

  const { isPride, highSignalNotificationFilter } = body as ExtensionRequest;

  try {
    const payload = parseJwt(accessToken);
    const redis = createRedisClient();

    const data = await prisma.preference.upsert({
      where: { id: payload.id },
      update: {
        isPride: isPride,
        highSignalNotificationFilter: highSignalNotificationFilter
      },
      create: {
        id: payload.id,
        isPride: isPride,
        highSignalNotificationFilter: highSignalNotificationFilter
      }
    });

    // Delete the cache
    await redis.del(`preferences:${payload.id}`);

    return res.status(200).json({ success: true, result: data });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
