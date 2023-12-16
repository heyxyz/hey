import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import validateLensAccount from '@utils/middlewares/validateLensAccount';
import prisma from '@utils/prisma';
import { invalidBody, noBody, notAllowed } from '@utils/responses';
import { number, object, string } from 'zod';

type MessagesRequest = {
  conversationId: string;
  limit: number;
  offset: number;
};

const messagesValidationSchema = object({
  conversationId: string(),
  limit: number(),
  offset: number()
});

export const post: Handler = async (req, res) => {
  const { body } = req;

  if (!body) {
    return noBody(res);
  }

  const validation = messagesValidationSchema.safeParse(body);

  if (!validation.success) {
    return invalidBody(res);
  }

  if (!(await validateLensAccount(req))) {
    return notAllowed(res);
  }

  const { conversationId, limit, offset } = body as MessagesRequest;

  try {
    const conversationExists = await prisma.conversation.findUnique({
      where: { id: conversationId }
    });

    if (!conversationExists) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
      where: { conversationId }
    });

    logger.info(`Retrieved all messages for ${conversationId}`);

    return res.status(200).json({ messages, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
