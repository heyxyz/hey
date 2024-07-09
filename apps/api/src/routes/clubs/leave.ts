import type { Handler } from 'express';

import { CLUBS_API_URL, CLUBS_APP_TOKEN } from '@hey/data/constants';
import logger from '@hey/helpers/logger';
import catchedError from 'src/helpers/catchedError';
import { HEY_USER_AGENT } from 'src/helpers/constants';
import { invalidBody, noBody } from 'src/helpers/responses';
import { object, string } from 'zod';

const validationSchema = object({
  id: string().optional()
});

export const post: Handler = async (req, res) => {
  const { body } = req;

  if (!body) {
    return noBody(res);
  }

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return invalidBody(res);
  }

  try {
    const accessToken = req.headers['x-access-token'] as string;
    const response = await fetch(`${CLUBS_API_URL}/leave-club`, {
      body: JSON.stringify(body),
      headers: {
        'App-Access-Token': CLUBS_APP_TOKEN,
        'Content-Type': 'application/json',
        'User-Agent': HEY_USER_AGENT,
        'X-Access-Token': accessToken
      },
      method: 'POST'
    });

    logger.info(`Left a club ${body.id}`);

    return res.status(response.status).json(await response.json());
  } catch (error) {
    return catchedError(res, error);
  }
};
