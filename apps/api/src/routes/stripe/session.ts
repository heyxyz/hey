import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import createStripeClient from 'src/lib/createStripeClient';
import { noBody } from 'src/lib/responses';

export const get: Handler = async (req, res) => {
  const { id, plan } = req.query;

  if (!id || !plan) {
    return noBody(res);
  }

  try {
    const stripe = createStripeClient();

    const stripeSession = await stripe.checkout.sessions.create({
      allow_promotion_codes: true,
      automatic_tax: { enabled: false },
      billing_address_collection: 'required',
      client_reference_id: id.toString(),
      line_items: [{ price: plan.toString(), quantity: 1 }],
      mode: 'subscription',
      success_url: `https://hey.xyz/pro/success`
    });
    logger.info(`Stripe session created for ${id}`);

    return res.status(200).json({ url: stripeSession.url });
  } catch (error) {
    return catchedError(res, error);
  }
};
