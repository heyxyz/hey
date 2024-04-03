import { PUBLICATION } from '@hey/data/tracking';
import logger from '@hey/lib/logger';
import { StackClient } from '@stackso/js-core';

const stack = new StackClient({
  apiKey: process.env.STACK_SO_API_KEY!,
  pointSystemId: process.env.NEXT_PUBLIC_LENS_NETWORK === 'mainnet' ? 691 : 691
});

const SCORABLE_EVENTS = [
  { event: PUBLICATION.LIKE, points: 10 },
  { event: PUBLICATION.MIRROR, points: 15 },
  { event: PUBLICATION.COLLECT_MODULE.COLLECT, points: 20 }
];

const grantScore = ({
  address,
  event,
  id
}: {
  address: string;
  event: string;
  id: string;
}): null | string => {
  if (!SCORABLE_EVENTS.some((e) => e.event === event)) {
    return null;
  }

  stack
    .track(event, {
      account: address,
      points: SCORABLE_EVENTS.find((e) => e.event === event)!.points,
      uniqueId: id
    })
    .then(({ messageId }) => {
      logger.info(
        `Granted ${SCORABLE_EVENTS.find((e) => e.event === event)!.points} points to ${address} for ${event} - ${messageId}`
      );
    });

  return id;
};

export default grantScore;
