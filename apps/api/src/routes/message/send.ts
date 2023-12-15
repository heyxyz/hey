import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import prisma from '@utils/prisma';
import { invalidBody, noBody } from '@utils/responses';
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

  const validation = messageValidationSchema.safeParse(body);

  if (!validation.success) {
    return invalidBody(res);
  }

  const { content, conversationId } = body as MessageRequest;

  try {
    const conversationExists = await prisma.conversation.findUnique({
      where: { id: conversationId }
    });

    if (!conversationExists) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Create the message
    const message = await prisma.message.create({
      data: { content, conversationId, senderId: '0x0d' }
    });

    logger.info(`Created a new message ${message.id}`);

    return res.status(200).json({ message, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
