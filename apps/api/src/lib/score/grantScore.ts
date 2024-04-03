import { PUBLICATION } from '@hey/data/tracking';
import logger from '@hey/lib/logger';
import { StackClient } from '@stackso/js-core';

const SCORABLE_EVENTS = [
  { event: PUBLICATION.LIKE, points: 10 },
  { event: PUBLICATION.MIRROR, points: 15 },
  { event: PUBLICATION.COLLECT_MODULE.COLLECT, points: 20 },
  { event: PUBLICATION.OPEN_ACTIONS.TIP.TIP, points: 25 },
  { event: PUBLICATION.OPEN_ACTIONS.SWAP.SWAP, points: 25 },
  { event: PUBLICATION.NEW_POST, points: 30 },
  { event: PUBLICATION.NEW_QUOTE, points: 30 },
  { event: PUBLICATION.NEW_COMMENT, points: 30 },
  { event: PUBLICATION.INTERESTED, points: 20 },
  { event: PUBLICATION.BOOKMARK, points: 10 },
  { event: PUBLICATION.NEW_COMMENT, points: 30 },
  { event: PUBLICATION.UNLIKE, points: -5 },
  { event: PUBLICATION.NOT_INTERESTED, points: -10 }
];

const grantScore = ({
  address,
  event,
  id,
  pointSystemId
}: {
  address: string;
  event: string;
  id: string;
  pointSystemId: number;
}): null | string => {
  console.log(id);
  const stack = new StackClient({
    apiKey: process.env.STACK_SO_API_KEY!,
    pointSystemId
  });

  const eventPoints = SCORABLE_EVENTS.find((e) => e.event === event)?.points;

  if (!eventPoints) {
    return null;
  }

  stack
    .track(event, {
      account: address,
      points: eventPoints,
      uniqueId: id
    })
    .then(({ messageId }) => {
      logger.info(
        `Granted ${eventPoints} points to ${address} for ${event} - ${messageId}`
      );
    });

  return id;
};

export default grantScore;
