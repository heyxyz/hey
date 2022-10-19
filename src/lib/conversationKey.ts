const CONVERSATION_KEY_RE = /^(.*)\/lens\.dev\/dm\/(.*)-(.*)$/;

export const buildConversationKey = (peerAddress: string, conversationId: string): string =>
  `${peerAddress.toLowerCase()}/${conversationId}`;

export const extractPeerAddressFromConversationKey = (conversationKey: string): string | null => {
  const chunks = conversationKey.split('/');
  if (!chunks.length) {
    return null;
  }
  return chunks[0];
};

export const parseConversationKey = (
  conversationKey: string
): { peerAddress: string; members: string[]; conversationId: string } | null => {
  const matches = conversationKey.match(CONVERSATION_KEY_RE);
  if (!matches || matches.length !== 4) {
    return null;
  }

  const [, peerAddress, memberA, memberB] = Array.from(matches);

  return { peerAddress, members: [memberA, memberB], conversationId: `lens.dev/dm/${memberA}-${memberB}` };
};
