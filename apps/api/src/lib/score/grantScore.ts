import { ALL_EVENTS } from '@hey/data/tracking';
import logger from '@hey/lib/logger';

import findEventKeyDeep from '../leafwatch/findEventKeyDeep';
import prisma from '../prisma';
import createStackClient from './createStackClient';

const findEventKey = (eventString: string): null | string => {
  return findEventKeyDeep(ALL_EVENTS, eventString);
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
