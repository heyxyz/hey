import type { FastifyRequest } from 'fastify';
import { z } from 'zod';

import handleIndexerPostCreated from '../helpers/handleIndexerPostCreated';
import handlePublicationHidden from '../helpers/handlePublicationHidden';

const snsMessageSchema = z.discriminatedUnion('Type', [
  z.object({
    Type: z.literal('Notification'),
    Message: z.string()
  }),

  z.object({
    Type: z.literal('SubscriptionConfirmation'),
    SubscribeURL: z.string()
  })
]);

const firehose = async (request: FastifyRequest) => {
  const body = await request.body;
  if (!body) {
    return { success: false, error: 'No body provided!' };
  }

  try {
    const payload: unknown = JSON.parse(JSON.stringify(body));
    console.log('payload', typeof payload);
    const json = snsMessageSchema.parse(payload);

    if (json.Type === 'SubscriptionConfirmation') {
      await fetch(json.SubscribeURL);
    }

    if (json.Type === 'Notification') {
      const { type, data } = JSON.parse(json.Message);
      console.log('type', type);

      if (type === 'INDEXER_POST_CREATED') {
        await handleIndexerPostCreated(data);
      } else if (type === 'PUBLICATION_HIDDEN') {
        await handlePublicationHidden(data);
      } else {
        return { success: true };
      }
    }

    return { success: true };
  } catch (error) {
    throw error;
  }
};

export default firehose;
