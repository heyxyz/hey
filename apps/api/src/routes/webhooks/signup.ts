import type { Handler } from 'express';

import { Errors } from '@hey/data';
import { POLYGONSCAN_URL } from '@hey/data/constants';
import { Regex } from '@hey/data/regex';
import axios from 'axios';
import catchedError from 'src/helpers/catchedError';
import { invalidBody, noBody } from 'src/helpers/responses';
import { object, string } from 'zod';

type ExtensionRequest = {
  event: { data: { block: { hash: string } } };
};

const validationSchema = object({
  event: object({
    data: object({ block: object({ hash: string().regex(Regex.txHash) }) })
  })
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
    await axios.post(process.env.SLACK_WEBHOOK_URL!, {
      channel: '#signups',
      icon_emoji: ':hey:',
      text: `A new profile has been signed up to :hey:\n\n${POLYGONSCAN_URL}/tx/${event.data.block.hash}`,
      username: 'Hey'
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
