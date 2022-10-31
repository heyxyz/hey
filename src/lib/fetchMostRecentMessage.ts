import type { Conversation, DecodedMessage } from '@xmtp/xmtp-js';
import { SortDirection } from '@xmtp/xmtp-js';

import { buildConversationKey } from './conversationKey';

export const fetchMostRecentMessage = async (
  convo: Conversation
): Promise<{ key: string; message?: DecodedMessage }> => {
  const key = buildConversationKey(convo.peerAddress, convo.context?.conversationId as string);

  const newMessages = await convo.messages({
    limit: 1,
    direction: SortDirection.SORT_DIRECTION_DESCENDING
  });
  if (newMessages.length <= 0) {
    return { key };
  }
  return { key, message: newMessages[0] };
};
