import type { Handler } from 'express';

import { LIVEPEER_KEY } from '@hey/data/constants';
import logger from '@hey/lib/logger';
import parseJwt from '@hey/lib/parseJwt';
import catchedError from 'src/helpers/catchedError';
import { invalidBody, noBody } from 'src/helpers/responses';
import { v4 as uuid } from 'uuid';
import { boolean, object } from 'zod';

type ExtensionRequest = {
  record: boolean;
};

const validationSchema = object({
  record: boolean()
});

export const post: Handler = async (req, res) => {
  const { body } = req;

  if (!body) {
    return noBody(res);
  }

  const accessToken = req.headers['x-access-token'] as string;
  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return invalidBody(res);
  }

  const { record } = body as ExtensionRequest;

  try {
    const payload = parseJwt(accessToken);
    const livepeerResponse = await fetch('https://livepeer.studio/api/stream', {
      body: JSON.stringify({
        name: `${payload.id}-${uuid()}`,
        profiles: [
          { bitrate: 3000000, fps: 0, height: 720, name: '720p0', width: 1280 },
          {
            bitrate: 6000000,
            fps: 0,
            height: 1080,
            name: '1080p0',
            width: 1920
          }
        ],
        record
      }),
      headers: {
        Authorization: `Bearer ${LIVEPEER_KEY}`,
        'content-type': 'application/json'
      },
      method: 'POST'
    });

    const result = await livepeerResponse.json();
    logger.info(`Created stream live stream by ${payload.id}`);

    return res.status(200).json({ result, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
