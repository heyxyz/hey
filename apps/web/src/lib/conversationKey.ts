import { XMTP_PREFIX } from 'data/constants';

const CONVERSATION_KEY_RE = /^(.*)\/lens\.dev\/dm\/(.*)-(.*)$/;

/**
 * Builds a conversation key for a given peer address and conversation id
 *
 * @param peerAddress The peer address of the user
 * @param conversationId The conversation id
 * @returns The conversation key
 */
export const buildConversationKey = (
  peerAddress: string,
  conversationId: string
): string =>
  conversationId
    ? `${peerAddress.toLowerCase()}/${conversationId}`
    : peerAddress.toLowerCase();

/**
 * Parses a conversation key into its peer address, members, and conversation id
 *
 * @param conversationKey The conversation key
 * @returns An object containing the peer address, members, and conversation id, or null if the conversation key is invalid
 */
export const parseConversationKey = (
  conversationKey: string
): {
  peerAddress: string;
  members: string[];
  conversationId?: string;
} | null => {
  const matches = conversationKey.match(CONVERSATION_KEY_RE);

  if (!matches || matches.length !== 4) {
    return {
      peerAddress: conversationKey,
      members: []
    };
  }

  const [, peerAddress, memberA, memberB] = Array.from(matches);

  return {
    peerAddress,
    members: [memberA, memberB],
    conversationId: `${XMTP_PREFIX}/${memberA}-${memberB}`
  };
};
