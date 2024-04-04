import { ALL_EVENTS } from '@hey/data/tracking';
import logger from '@hey/lib/logger';

import prisma from '../prisma';
import createStackClient from './createStackClient';

const findEventKey = (eventString: string): null | string => {
  const eventKey = Object.keys(ALL_EVENTS).find(
    (key) => ALL_EVENTS[key as keyof typeof ALL_EVENTS] === eventString
  );

  return eventKey || null;
};

const grantScore = ({
  address,
  id,
  name,
  pointSystemId
}: {
  address: string;
  id: string;
  name: string;
  pointSystemId: number;
}): null | string => {
  const eventKey = findEventKey(name);
  if (!eventKey) {
    logger.error(`Event not found for string: ${name}`);
    return null;
  }

  prisma.scorableEvent
    .findUnique({ where: { eventType: eventKey } })
    .then((event) => {
      if (event?.points) {
        const stack = createStackClient(pointSystemId);
        stack
          .track(event.eventType, {
            account: address,
            points: event.points,
            uniqueId: id
          })
          .then(({ messageId }) => {
            logger.info(
              `Granted ${event.points} points to ${address} for ${event.eventType} - ${messageId}`
            );
          })
          .catch((error) =>
            logger.error(`Error tracking event: ${error.message}`)
          );
      }
    })
    .catch((error) =>
      logger.error(`Error retrieving event points: ${error.message}`)
    );

  return id;
};

export default grantScore;
