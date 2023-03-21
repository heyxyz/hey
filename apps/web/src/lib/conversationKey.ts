import { XMTP_PREFIX } from 'data/constants';

const CONVERSATION_KEY_RE = /^(.*)\/lens\.dev\/dm\/(.*)-(.*)$/;

/**
 *
 * @param peerAddress the peer address of the user
 * @param conversationId the conversation id
 * @returns the conversation key
 */
export const buildConversationKey = (peerAddress: string, conversationId: string): string =>
  `${peerAddress.toLowerCase()}/${conversationId}`;

/**
 *
 * @param conversationKey the conversation key
 * @returns the peer address, members, and conversation id
 */
export const parseConversationKey = (
  conversationKey: string
): { peerAddress: string; members: string[]; conversationId: string } | null => {
  const matches = conversationKey.match(CONVERSATION_KEY_RE);
  if (!matches || matches.length !== 4) {
    return null;
  }

  const [, peerAddress, memberA, memberB] = Array.from(matches);

  return {
    peerAddress,
    members: [memberA, memberB],
    conversationId: `${XMTP_PREFIX}/${memberA}-${memberB}`
  };
};
