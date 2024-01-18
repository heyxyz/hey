import type { Handler } from 'express';

import catchedError from '@utils/catchedError';
import createStripeClient from '@utils/createStripeClient';
import { noBody } from '@utils/responses';

export const get: Handler = async (req, res) => {
  const { email, id, plan } = req.query;

  if (!id || !plan || !email) {
    return noBody(res);
  }

  try {
    const stripe = createStripeClient();

    const stripeSession = await stripe.checkout.sessions.create({
      allow_promotion_codes: true,
      automatic_tax: { enabled: false },
      billing_address_collection: 'required',
      client_reference_id: id.toString(),
      customer_email: email.toString(),
      line_items: [{ price: plan.toString(), quantity: 1 }],
      mode: 'subscription',
      success_url: `https://hey.xyz/pro/success`
    });

    return res.status(200).json({ url: stripeSession.url });
  } catch (error) {
    return catchedError(res, error);
  }
};
