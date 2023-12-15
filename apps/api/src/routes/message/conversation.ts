import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import validateLensAccount from '@utils/middlewares/validateLensAccount';
import prisma from '@utils/prisma';
import { invalidBody, noBody, notAllowed } from '@utils/responses';
import { object, string } from 'zod';

type ConversationRequest = {
  recipient: string;
  sender: string;
};

const conversationValidationSchema = object({
  recipient: string(),
  sender: string()
});

export const get: Handler = async (req, res) => {
  const { body } = req;

  if (!body) {
    return noBody(res);
  }

  const validation = conversationValidationSchema.safeParse(body);

  if (!validation.success) {
    return invalidBody(res);
  }

  if (!(await validateLensAccount(req))) {
    return notAllowed(res);
  }

  const { recipient, sender } = body as ConversationRequest;

  try {
    // Check if a conversation already exists
    let conversation = await prisma.conversation.findFirst({
      include: { messages: { orderBy: { createdAt: 'desc' }, take: 1 } },
      where: {
        OR: [
          { recipient, sender },
          { recipient: sender, sender: recipient }
        ]
      }
    });

    // If not, create a new conversation
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { recipient, sender },
        include: { messages: { orderBy: { createdAt: 'desc' }, take: 1 } }
      });
      logger.info(`Created a new conversation ${conversation.id}`);
    } else {
      logger.info(`Retrieved existing conversation ${conversation.id}`);
    }

    const processedConversations = {
      ...conversation,
      latestMessages: conversation.messages[0].content,
      profile:
        conversation.sender === sender
          ? conversation.recipient
          : conversation.sender
    };

    return res
      .status(200)
      .json({ conversation: processedConversations, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
