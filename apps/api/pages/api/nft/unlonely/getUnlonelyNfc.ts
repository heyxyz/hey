import { Errors } from '@hey/data/errors';
import allowCors from '@utils/allowCors';
import { CACHE_AGE_59 } from '@utils/constants';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
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
            query GetNFC {
              getNFC(id: "${id}") {
                id
                createdAt 
                videoLink
                videoThumbnail
                openseaLink
                title
                owner {
                  username
                  FCImageUrl
                  lensImageUrl
                }
              }
            }
          `
        })
      }
    );
    const nfc: {
      data: { getNFC: any };
    } = await unlonelyResponse.json();

    return res.status(200).setHeader('Cache-Control', CACHE_AGE_59).json({
      success: true,
      nfc: nfc.data.getNFC
    });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
