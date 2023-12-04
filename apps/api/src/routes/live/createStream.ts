import logger from '@hey/lib/logger';
import parseJwt from '@hey/lib/parseJwt';
import catchedError from '@utils/catchedError';
import { invalidBody, noBody } from '@utils/responses';
import type { Handler } from 'express';
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
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${process.env.LIVEPEER_API_KEY}`
      },
      body: JSON.stringify({
        name: `${payload.id}-${uuid()}`,
        record,
        profiles: [
          { name: '720p0', fps: 0, bitrate: 3000000, width: 1280, height: 720 },
          {
            name: '1080p0',
            fps: 0,
            bitrate: 6000000,
            width: 1920,
            height: 1080
          }
        ]
      })
    });

    const result = await livepeerResponse.json();
    logger.info(`Created stream live stream by ${payload.id}`);

    return res.status(200).json({ success: true, result });
  } catch (error) {
    return catchedError(res, error);
  }
};
