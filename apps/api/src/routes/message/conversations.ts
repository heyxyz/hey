import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import prisma from '@utils/prisma';
import { invalidBody, noBody } from '@utils/responses';
import { object, string } from 'zod';

type ConversationsRequest = {
  profile: string;
};

const conversationsValidationSchema = object({
  profile: string()
});

export const post: Handler = async (req, res) => {
  const { body } = req;

  if (!body) {
    return noBody(res);
  }

  const validation = conversationsValidationSchema.safeParse(body);

  if (!validation.success) {
    return invalidBody(res);
  }

  const { profile } = body as ConversationsRequest;

  try {
    const conversations = await prisma.conversation.findMany({
      include: { messages: { orderBy: { createdAt: 'desc' }, take: 1 } },
      orderBy: { updatedAt: 'desc' },
      where: {
        OR: [{ sender: profile }, { recipient: profile }]
      }
    });

    logger.info(`Retrieved all conversations for ${profile}`);

    return res.status(200).json({ conversations, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
