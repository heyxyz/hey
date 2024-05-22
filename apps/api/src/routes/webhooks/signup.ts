import type { Handler } from 'express';

import { Errors } from '@hey/data';
import { POLYGONSCAN_URL } from '@hey/data/constants';
import axios from 'axios';
import catchedError from 'src/helpers/catchedError';
import { invalidBody, noBody } from 'src/helpers/responses';
import { any, object } from 'zod';

type ExtensionRequest = {
  event: { activity: any };
};

const validationSchema = object({
  event: object({ activity: any() })
});

export const post: Handler = async (req, res) => {
  const { body } = req;
  const { secret } = req.query;

  if (secret !== process.env.SECRET) {
    return res
      .status(400)
      .json({ error: Errors.InvalidSecret, success: false });
  }

  if (!body) {
    return noBody(res);
  }

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return invalidBody(res);
  }

  const { event } = body as ExtensionRequest;

  try {
    await axios.post(
      `${process.env.SLACK_WEBHOOK_URL}/B074BSCRYBY/oje0JD1ymgzB6ZTMNe0zBvRM`,
      {
        channel: '#signups',
        icon_emoji: ':hey:',
        text: `A new profile has been signed up to :hey:\n\n${POLYGONSCAN_URL}/tx/${event.activity[0].hash}`,
        username: 'Hey'
      }
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
