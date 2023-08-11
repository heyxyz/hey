import { Errors } from '@lenster/data/errors';
import type { IRequest } from 'itty-router';
import { z } from 'zod';

import handleIndexerPostCreated from '../helpers/handleIndexerPostCreated';
import handlePublicationHidden from '../helpers/handlePublicationHidden';
import type { Env } from '../types';

type ExtensionRequest = {
  type?: string;
  data: any;
};

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

export default async (request: IRequest, env: Env) => {
  const body = await request.json();
  if (!body) {
    return new Response(
      JSON.stringify({ success: false, error: Errors.NoBody })
    );
  }

  try {
    const payload: unknown = JSON.parse(JSON.stringify(body));
    const json = snsMessageSchema.parse(payload);

    if (json.Type === 'SubscriptionConfirmation') {
      await fetch(json.SubscribeURL);
    }

    if (json.Type === 'Notification') {
      const { type, data } = JSON.parse(json.Message) as ExtensionRequest;

      if (type === 'INDEXER_POST_CREATED') {
        await handleIndexerPostCreated(data, env);
      } else if (type === 'PUBLICATION_HIDDEN') {
        await handlePublicationHidden(data, env);
      } else {
        return new Response(JSON.stringify({ success: true }));
      }
    }

    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    throw error;
  }
};
