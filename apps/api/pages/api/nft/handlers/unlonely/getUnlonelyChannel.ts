import { Errors } from '@hey/data/errors';
import type { NextApiRequest, NextApiResponse } from 'next';
import allowCors from 'utils/allowCors';
import { CACHE_AGE } from 'utils/constants';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
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

    return res.status(200).setHeader('Cache-Control', CACHE_AGE).json({
      success: true,
      channel: channel.data.getChannelBySlug
    });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
