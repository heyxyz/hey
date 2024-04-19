import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import parseJwt from '@hey/lib/parseJwt';
import catchedError from 'src/lib/catchedError';
import heyPrisma from 'src/lib/heyPrisma';
import validateLensAccount from 'src/lib/middlewares/validateLensAccount';
import { invalidBody, noBody, notAllowed } from 'src/lib/responses';
import { object, string } from 'zod';

type ExtensionRequest = {
  option: string;
  poll: string;
};

const validationSchema = object({
  option: string().uuid(),
  poll: string().uuid()
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

  const { option, poll } = body as ExtensionRequest;

  try {
    const payload = parseJwt(accessToken);

    // Begin: Check if the poll expired
    const pollData = await heyPrisma.poll.findUnique({
      where: { id: poll }
    });

    if ((pollData?.endsAt as Date).getTime() < Date.now()) {
      return res.status(400).json({ error: 'Poll expired.', success: false });
    }
    // End: Check if the poll expired

    // Begin: Check if the poll exists and delete the existing response
    const existingResponse = await heyPrisma.pollResponse.findFirst({
      where: {
        option: { pollId: poll },
        profileId: payload.id
      }
    });

    if (existingResponse) {
      await heyPrisma.pollResponse.delete({
        where: { id: existingResponse.id }
      });
    }
    // End: Check if the poll exists and delete the existing response

    const data = await heyPrisma.pollResponse.create({
      data: { optionId: option, profileId: payload.id }
    });

    logger.info(`Responded to a poll ${option}:${data.id}`);

    return res.status(200).json({ id: data.id, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
