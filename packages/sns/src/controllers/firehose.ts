import type { FastifyRequest } from 'fastify';

import handleIndexerPostCreated from '../helpers/handleIndexerPostCreated';
import handlePublicationHidden from '../helpers/handlePublicationHidden';
import handleReaction from '../helpers/handleReaction';

const firehose = async (request: FastifyRequest) => {
  const body = await request.body;
  if (!body) {
    return { success: false, error: 'No body provided!' };
  }

  try {
    const json: any = JSON.parse(body as string);

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
      } else if (type === 'PUBLICATION_REACTION') {
        await handleReaction(data);
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
