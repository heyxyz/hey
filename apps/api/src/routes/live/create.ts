import type { Request, Response } from 'express';

import { LIVEPEER_KEY } from '@hey/data/constants';
import logger from '@hey/helpers/logger';
import parseJwt from '@hey/helpers/parseJwt';
import catchedError from 'src/helpers/catchedError';
import { rateLimiter } from 'src/helpers/middlewares/rateLimiter';
import { invalidBody, noBody } from 'src/helpers/responses';
import { v4 as uuid } from 'uuid';
import { boolean, object } from 'zod';

type ExtensionRequest = {
  record: boolean;
};

const validationSchema = object({
  record: boolean()
});

export const post = [
  rateLimiter({ requests: 10, within: 60 }),
  async (req: Request, res: Response) => {
    const { body } = req;

    if (!body) {
      return noBody(res);
    }

    const validation = validationSchema.safeParse(body);

    if (!validation.success) {
      return invalidBody(res);
    }

    const { record } = body as ExtensionRequest;

    try {
      const identityToken = req.headers['x-identity-token'] as string;
      const payload = parseJwt(identityToken);
      const livepeerResponse = await fetch(
        'https://livepeer.studio/api/stream',
        {
          body: JSON.stringify({
            name: `${payload.id}-${uuid()}`,
            profiles: [
              {
                bitrate: 3000000,
                fps: 0,
                height: 720,
                name: '720p0',
                width: 1280
              },
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
        }
      );

      const result = await livepeerResponse.json();
      logger.info(`Created stream live stream by ${payload.id}`);

      return res.status(200).json({ result, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
