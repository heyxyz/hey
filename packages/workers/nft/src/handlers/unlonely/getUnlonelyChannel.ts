import response from '@hey/lib/response';

import type { WorkerRequest } from '../../types';

export default async (request: WorkerRequest) => {
  const { slug } = request.query;

  if (!slug) {
    return response({ success: false, error: 'No slug provided' });
  }

  try {
    const unlonelyResponse = await fetch(
      'https://unlonely-vqeii.ondigitalocean.app/graphql',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-agent': 'Hey.xyz'
        },
        body: JSON.stringify({
          query: `
            query GetChannelBySlug {
              getChannelBySlug(slug: "${slug}") {
                id
                slug
                name
                description
                playbackUrl
                isLive
              }
            }
          `
        })
      }
    );
    const channel: {
      data: { getChannelBySlug: any };
    } = await unlonelyResponse.json();

    return response({
      success: true,
      channel: channel.data.getChannelBySlug
    });
  } catch (error) {
    throw error;
  }
};
