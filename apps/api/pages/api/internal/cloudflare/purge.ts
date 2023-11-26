import { Errors } from '@hey/data/errors';
import logger from '@hey/lib/logger';
import allowCors from '@utils/allowCors';
import catchedError from '@utils/catchedError';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { secret } = req.query;

  if (secret !== process.env.SECRET) {
    return res
      .status(400)
      .json({ success: false, error: Errors.InvalidSecret });
  }

  try {
    const response = await fetch(
      'https://api.cloudflare.com/client/v4/zones/2fd5485fa6cd159b1d4b39f1af6bb690/purge_cache',
      {
        method: 'POST',
        body: JSON.stringify({ purge_everything: true }),
        headers: { Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}` }
      }
    );

    const json: { result: { id: string } } = await response.json();
    logger.info(`Purged Cloudflare cache: ${json.result.id}`);

    return res.status(200).json({ success: true, id: json.result.id });
  } catch (error) {
    return catchedError(res, error);
  }
};

export default allowCors(handler);
