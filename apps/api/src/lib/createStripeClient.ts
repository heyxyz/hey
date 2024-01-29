import Stripe from 'stripe';

const createStripeClient = () => {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
};

export default createStripeClient;
