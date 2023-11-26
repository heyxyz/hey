import { Errors } from '@hey/data/errors';
import logger from '@hey/lib/logger';
import parseJwt from '@hey/lib/parseJwt';
import allowCors from '@utils/allowCors';
import catchedError from '@utils/catchedError';
import validateLensAccount from '@utils/middlewares/validateLensAccount';
import prisma from '@utils/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { object, string } from 'zod';

type ExtensionRequest = {
  poll: string;
  option: string;
};

const validationSchema = object({
  poll: string().uuid(),
  option: string().uuid()
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

  const { poll, option } = body as ExtensionRequest;

  try {
    const payload = parseJwt(accessToken);

    // Begin: Check if the poll expired
    const pollData = await prisma.poll.findUnique({
      where: { id: poll }
    });

    if ((pollData?.endsAt as Date).getTime() < Date.now()) {
      return res.status(400).json({ success: false, error: 'Poll expired.' });
    }
    // End: Check if the poll expired

    // Begin: Check if the poll exists and delete the existing response
    const existingResponse = await prisma.pollResponse.findFirst({
      where: {
        profileId: payload.id,
        option: { pollId: poll }
      }
    });

    if (existingResponse) {
      await prisma.pollResponse.delete({
        where: { id: existingResponse.id }
      });
    }
    // End: Check if the poll exists and delete the existing response

    const data = await prisma.pollResponse.create({
      data: { profileId: payload.id, optionId: option }
    });

    logger.info(`Responded to a poll ${option}:${data.id}`);

    return res.status(200).json({ success: true, id: data.id });
  } catch (error) {
    return catchedError(res, error);
  }
};

export default allowCors(handler);
