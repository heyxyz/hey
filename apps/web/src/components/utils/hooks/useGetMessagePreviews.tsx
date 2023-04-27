import chunkArray from '@lib/chunkArray';
import { buildConversationKey } from '@lib/conversationKey';
import type { Conversation } from '@xmtp/xmtp-js';
import { SortDirection } from '@xmtp/xmtp-js';
import type { DecodedMessage } from '@xmtp/xmtp-js/dist/types/src/Message';
import { useEffect, useRef, useState } from 'react';
import { useMessageStore } from 'src/store/message';

import { useMessageDb } from './useMessageDb';

const fetchMostRecentMessage = async (
  convo: Conversation
): Promise<{ key: string; message?: DecodedMessage }> => {
  const key = buildConversationKey(convo.peerAddress, convo.context?.conversationId as string);
  const latestMessageQuery = await convo.messages({
    limit: 1,
    direction: SortDirection.SORT_DIRECTION_DESCENDING
  });
  if (latestMessageQuery.length <= 0) {
    return { key };
  }
  return { key, message: latestMessageQuery[0] };
};

const useGetMessagePreviews = () => {
  const conversations = useMessageStore((state) => state.conversations);
  const previewMessages = useMessageStore((state) => state.previewMessages);
  const client = useMessageStore((state) => state.client);
  const { batchPersistPreviewMessages } = useMessageDb();
  const hasSyncedMessages = useMessageStore((state) => state.hasSyncedMessages);
  const setHasSyncedMessages = useMessageStore((state) => state.setHasSyncedMessages);
  const [loading, setLoading] = useState<boolean>(false);
  const loadingRef = useRef<boolean>(false);
  const countRef = useRef<number>(0);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (!client || loadingRef.current || hasSyncedMessages) {
      return;
    }

    const getMessagePreviews = async () => {
      const needsSync = [...conversations.values()];
      if (!needsSync.length) {
        return;
      }
      loadingRef.current = true;
      setLoading(true);
      console.log(`Syncing ${needsSync.length} conversations`);

      for (const chunk of chunkArray(needsSync, 50)) {
        // Yield to the UI between pages of conversations, since this all happens in the background
        await new Promise((resolve) => requestAnimationFrame(resolve));
        const batch = (
          await Promise.all(
            chunk.map(async (convo) => {
              const latestMessage = await fetchMostRecentMessage(convo);
              const existingValue = previewMessages.get(latestMessage.key)?.sent;
              countRef.current = countRef.current + 1;
              setProgress(Math.round((countRef.current / needsSync.length) * 100));

              if (latestMessage.message && (!existingValue || latestMessage?.message.sent > existingValue)) {
                return [latestMessage.key, latestMessage.message];
              }
            })
          )
        ).filter((m) => !!m) as [string, DecodedMessage][];
        await batchPersistPreviewMessages(new Map(batch));
      }

      setLoading(false);
      setHasSyncedMessages(true);
      loadingRef.current = false;
    };

    getMessagePreviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, conversations]);

  return {
    loading,
    progress
  };
};

export default useGetMessagePreviews;
