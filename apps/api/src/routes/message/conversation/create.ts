import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import parseJwt from '@hey/lib/parseJwt';
import catchedError from '@utils/catchedError';
import validateLensAccount from '@utils/middlewares/validateLensAccount';
import prisma from '@utils/prisma';
import { invalidBody, noBody, notAllowed } from '@utils/responses';
import { object, string } from 'zod';

type ConversationRequest = {
  recipient: string;
};

const conversationValidationSchema = object({
  recipient: string()
});

export const post: Handler = async (req, res) => {
  const { body } = req;

  if (!body) {
    return noBody(res);
  }

  const accessToken = req.headers['x-access-token'] as string;
  const validation = conversationValidationSchema.safeParse(body);

  if (!validation.success) {
    return invalidBody(res);
  }

  if (!(await validateLensAccount(req))) {
    return notAllowed(res);
  }

  const { recipient } = body as ConversationRequest;

  try {
    const payload = parseJwt(accessToken);
    const sender = payload.id;

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
      latestMessages: conversation.messages[0]?.content || null,
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
