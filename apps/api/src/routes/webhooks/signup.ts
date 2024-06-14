import type { Handler } from 'express';

import { Errors } from '@good/data';
import catchedError from 'src/helpers/catchedError';
import { invalidBody, noBody } from 'src/helpers/responses';
import saveSignupInvoiceToNotion from 'src/helpers/webhooks/saveSignupInvoiceToNotion';
import { any, object } from 'zod';

type ExtensionRequest = {
  event: { activity: any };
};

const validationSchema = object({
  event: object({ activity: any() })
});

export const post: Handler = (req, res) => {
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
    saveSignupInvoiceToNotion(
      event.activity[0].hash,
      event.activity[0].fromAddress
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
