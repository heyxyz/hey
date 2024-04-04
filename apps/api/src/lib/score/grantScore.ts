import { ALL_EVENTS } from '@hey/data/tracking';
import logger from '@hey/lib/logger';

import findEventKeyDeep from '../leafwatch/findEventKeyDeep';
import { getIpByActor, getIpByWallet } from '../leafwatch/getIp';
import prisma from '../prisma';
import createStackClient from './createStackClient';

const findScorableEventByEventType = async (eventType: string) => {
  return await prisma.scorableEvent.findUnique({ where: { eventType } });
};

const findEventKey = (eventString: string): null | string => {
  return findEventKeyDeep(ALL_EVENTS, eventString);
};

const grantScore = async ({
  address,
  id,
  name,
  pointSystemId,
  profile,
  scoreAddress
}: {
  address: string;
  id: string;
  name: string;
  pointSystemId: number;
  profile: string;
  scoreAddress?: string;
}): Promise<null | string> => {
  const eventKey = findEventKey(name);
  if (!eventKey) {
    return null;
  }

  const actorIp = await getIpByActor(profile);
  const walletIp = await getIpByWallet(scoreAddress);

  // To prevent abuse, we don't grant points if the actor and wallet IPs are the same
  if (actorIp === walletIp) {
    logger.info(
      `Abuse: Actor IP and wallet IP are the same - Actor: ${profile} - ${actorIp} - Wallet: ${scoreAddress} - ${walletIp}`
    );
    return null;
  }

  try {
    const event = await findScorableEventByEventType(eventKey);
    if (event?.points) {
      const stack = createStackClient(pointSystemId);
      try {
        const { messageId } = await stack.track(event.eventType, {
          account: address,
          metadata: { actor: profile },
          points: event.points,
          uniqueId: id
        });

        logger.info(
          `Granted ${event.points} points to ${address} for ${event.eventType} by ${profile} - ${messageId}`
        );
      } catch {
        logger.error('Error granting score on stack.so');
      }
    }
  } catch {
    logger.info('Error finding scorable event');
  }

  return id;
};

export default grantScore;
