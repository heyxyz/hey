import type { Handler } from 'express';
import type Stripe from 'stripe';

import logger from '@hey/lib/logger';
import createStripeClient from '@utils/createStripeClient';
import prisma from '@utils/prisma';
import { noBody } from '@utils/responses';

const stripe = createStripeClient();

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted'
]);

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

  if (!relevantEvents.has(event.type)) {
    logger.info(`[Webhook: Stripe]: Event type ${event.type} not handled.`);
    return res.send();
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const checkoutSession = event.data.object;

      if (
        checkoutSession.client_reference_id === null ||
        checkoutSession.customer === null
      ) {
        return;
      }

      const stripeId = checkoutSession.customer.toString();
      const subscription = await stripe.subscriptions.retrieve(
        checkoutSession.subscription as string
      );
      const plan = subscription.items.data[0].price.id;
      const profileId = checkoutSession.client_reference_id;
      const expiresAt = new Date(subscription.current_period_end * 1000);

      try {
        await prisma.pro.upsert({
          create: { expiresAt, plan, profileId, stripeId },
          update: { expiresAt, plan, stripeId },
          where: { profileId }
        });
      } catch {
        logger.error('[Webhook: Stripe]: Error creating subscription');
      }

      break;
    }
    // TODO: Handle subscription updates
    case 'customer.subscription.deleted': {
      const subscriptionDeleted = event.data.object;
      const stripeId = subscriptionDeleted.customer.toString();

      try {
        await prisma.pro.delete({ where: { stripeId } });
      } catch {
        logger.error('[Webhook: Stripe]: Error deleting subscription');
      }

      break;
    }
    default: {
      logger.info(`[Webhook: Stripe]: Unhandled event type ${event.type}`);
    }
  }

  return res.send();
};
