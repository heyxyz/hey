import { XMTP_PREFIX } from 'data/constants';

/**
 *
 * @param profileA profile handle of the first user
 * @param profileB profile handle of the second user
 * @returns the conversation id
 */
const buildConversationId = (profileA: string, profileB: string) => {
  const numberA = parseInt(profileA.substring(2), 16);
  const numberB = parseInt(profileB.substring(2), 16);
  return numberA < numberB
    ? `${XMTP_PREFIX}/${profileA}-${profileB}`
    : `${XMTP_PREFIX}/${profileB}-${profileA}`;
};

export default buildConversationId;
