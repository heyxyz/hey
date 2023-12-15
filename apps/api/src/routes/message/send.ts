import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import parseJwt from '@hey/lib/parseJwt';
import catchedError from '@utils/catchedError';
import validateLensAccount from '@utils/middlewares/validateLensAccount';
import prisma from '@utils/prisma';
import { invalidBody, noBody, notAllowed } from '@utils/responses';
import { object, string } from 'zod';

type MessageRequest = {
  content: string;
  conversationId: string;
};

const messageValidationSchema = object({
  content: string(),
  conversationId: string()
});

export const post: Handler = async (req, res) => {
  const { body } = req;

  if (!body) {
    return noBody(res);
  }

  const accessToken = req.headers['x-access-token'] as string;
  const validation = messageValidationSchema.safeParse(body);

  if (!validation.success) {
    return invalidBody(res);
  }

  if (!(await validateLensAccount(req))) {
    return notAllowed(res);
  }

  const { content, conversationId } = body as MessageRequest;

  try {
    const conversationExists = await prisma.conversation.findUnique({
      where: { id: conversationId }
    });

    if (!conversationExists) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const payload = parseJwt(accessToken);
    const profile = payload.id;

    // Create the message
    const message = await prisma.message.create({
      data: { content, conversationId, senderId: profile }
    });

    logger.info(`Created a new message ${message.id}`);

    return res.status(200).json({ message, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
