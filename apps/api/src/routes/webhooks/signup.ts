import type { Handler } from 'express';

import { Errors } from '@hey/data';
import { POLYGONSCAN_URL } from '@hey/data/constants';
import catchedError from 'src/helpers/catchedError';
import { invalidBody, noBody } from 'src/helpers/responses';
import sendSlackMessage from 'src/helpers/slack';
import sendSignupInvoice from 'src/helpers/webhooks/sendSignupInvoice';
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
    sendSignupInvoice(event.activity[0].fromAddress);
    await sendSlackMessage({
      channel: '#signups',
      color: '#22c55e',
      fields: [
        {
          short: false,
          title: 'Transaction',
          value: `${POLYGONSCAN_URL}/tx/${event.activity[0].hash}`
        }
      ],
      text: ':tada: A new profile has been signed up to :hey:'
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
