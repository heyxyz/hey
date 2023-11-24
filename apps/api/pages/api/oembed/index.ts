import { Errors } from '@hey/data/errors';
import allowCors from '@utils/allowCors';
import { CACHE_AGE_59 } from '@utils/constants';
import getMetadata from '@utils/oembed/getMetadata';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  try {
    return res
      .status(200)
      .setHeader('Cache-Control', CACHE_AGE_59)
      .json({
        success: true,
        oembed: await getMetadata(url as string)
      });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
