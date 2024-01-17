import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import { noBody } from '@utils/responses';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const post: Handler = async (req, res) => {
  const { body } = req;

  if (!body) {
    return noBody(res);
  }

  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (error) {
    logger.error('[Webhook: Stripe]: Signature verification failed.');
    return res.status(400).send('Webhook Error');
  }

  switch (event.type) {
    case 'customer.subscription.updated': {
      // const subscriptionCreatedEvent = event.data.object;
      // subscriptionCreatedEvent.current_period_start
      // subscriptionCreatedEvent.current_period_end
      // subscriptionCreatedEvent.customer
      break;
    }
    default: {
      logger.info(`[Webhook: Stripe]: Unhandled event type ${event.type}`);
    }
  }

  return res.send();
};
