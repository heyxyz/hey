import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import prisma from '@utils/prisma';
import { invalidBody, noBody } from '@utils/responses';
import { object, string } from 'zod';

type MessagesRequest = {
  conversationId: string;
};

const messagesValidationSchema = object({
  conversationId: string()
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

  const { conversationId } = body as MessagesRequest;

  try {
    const conversationExists = await prisma.conversation.findUnique({
      where: { id: conversationId }
    });

    if (!conversationExists) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'asc' },
      where: { conversationId }
    });

    logger.info(`Retrieved all messages for ${conversationId}`);

    return res.status(200).json({ messages, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
