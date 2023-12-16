import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import parseJwt from '@hey/lib/parseJwt';
import catchedError from '@utils/catchedError';
import validateLensAccount from '@utils/middlewares/validateLensAccount';
import prisma from '@utils/prisma';
import { invalidBody, noBody, notAllowed } from '@utils/responses';
import { number, object } from 'zod';

type ConversationsRequest = {
  limit: number;
  offset: number;
};

const conversationsValidationSchema = object({
  limit: number().max(100),
  offset: number().max(100)
});

export const post: Handler = async (req, res) => {
  const { body } = req;

  if (!body) {
    return noBody(res);
  }

  const accessToken = req.headers['x-access-token'] as string;
  const validation = conversationsValidationSchema.safeParse(body);

  if (!validation.success) {
    return invalidBody(res);
  }

  if (!(await validateLensAccount(req))) {
    return notAllowed(res);
  }

  const { limit, offset } = body as ConversationsRequest;

  try {
    const payload = parseJwt(accessToken);
    const profile = payload.id;

    const conversations = await prisma.conversation.findMany({
      include: { messages: { orderBy: { createdAt: 'desc' }, take: 1 } },
      orderBy: { updatedAt: 'desc' },
      skip: offset,
      take: limit,
      where: { OR: [{ sender: profile }, { recipient: profile }] }
    });

    const processedConversations = conversations.map((conversation) => {
      const { messages, ...rest } = conversation;
      return {
        ...rest,
        latestMessages: messages[0]?.content,
        profile: rest.sender === profile ? rest.recipient : rest.sender
      };
    });

    logger.info(`Retrieved all conversations for ${profile}`);

    return res
      .status(200)
      .json({ conversations: processedConversations, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
