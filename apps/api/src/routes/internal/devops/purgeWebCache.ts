import type { Handler } from 'express';

import { Errors } from '@hey/data/errors';
import logger from '@hey/helpers/logger';
import axios from 'axios';
import catchedError from 'src/helpers/catchedError';
import { noBody } from 'src/helpers/responses';

export const post: Handler = async (req, res) => {
  const { secret } = req.query;

  if (!secret) {
    return noBody(res);
  }

  if (secret !== process.env.SECRET) {
    return res
      .status(400)
      .json({ error: Errors.InvalidSecret, success: false });
  }

  try {
    const { data } = await axios.post(
      `https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE_ID}/purge_cache`,
      { purge_everything: true },
      { headers: { Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}` } }
    );

    logger.info('Cloudflare purged cache triggered successfully');

    return res.status(200).json({ result: data, success: true });
  } catch (error) {
    console.log(error);
    return catchedError(res, error);
  }
};
