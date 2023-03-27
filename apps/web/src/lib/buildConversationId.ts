import { XMTP_PREFIX } from 'data/constants';

/**
 * Builds a unique conversation ID for a chat between two users.
 *
 * @param profileA The profile handle of the first user.
 * @param profileB The profile handle of the second user.
 * @returns The conversation ID.
 */
const buildConversationId = (profileA: string, profileB: string) => {
  const numberA = parseInt(profileA.substring(2), 16);
  const numberB = parseInt(profileB.substring(2), 16);
  return numberA < numberB
    ? `${XMTP_PREFIX}/${profileA}-${profileB}`
    : `${XMTP_PREFIX}/${profileB}-${profileA}`;
};

export default buildConversationId;
