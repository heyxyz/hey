import chunkArray from '@lib/chunkArray';
import { buildConversationKey } from '@lib/conversationKey';
import type { Conversation, DecodedMessage } from '@xmtp/xmtp-js';
import { SortDirection } from '@xmtp/xmtp-js';
import { useEffect, useRef, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { useXmtpMessageStore } from 'src/store/xmtp-message';

import { useMessageDb } from './useMessageDb';

const fetchMostRecentMessage = async (
  convo: Conversation,
  checkAfter?: Date
): Promise<DecodedMessage | null> => {
  const latestMessageQuery = await convo.messages({
    limit: 1,
    direction: SortDirection.SORT_DIRECTION_DESCENDING,
    // Add 1ms to the start time to avoid getting the same message back
    startTime: checkAfter ? new Date(checkAfter.getTime() + 1) : undefined
  });
  if (latestMessageQuery.length <= 0) {
    return null;
  }
  return latestMessageQuery[0];
};

const useGetMessagePreviews = () => {
  const conversations = useXmtpMessageStore((state) => state.conversations);
  const previewMessages = useXmtpMessageStore((state) => state.previewMessages);
  const client = useXmtpMessageStore((state) => state.client);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { batchPersistPreviewMessages } = useMessageDb();
  const hasSyncedMessages = useXmtpMessageStore(
    (state) => state.hasSyncedMessages
  );
  const setHasSyncedMessages = useXmtpMessageStore(
    (state) => state.setHasSyncedMessages
  );
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

      for (const chunk of chunkArray(needsSync, 50)) {
        // Yield to the UI between pages of conversations, since this all happens in the background
        await new Promise((resolve) => requestAnimationFrame(resolve));
        const batch = (
          await Promise.all(
            chunk.map(async (convo) => {
              const key = buildConversationKey(
                convo.peerAddress,
                (convo.context?.conversationId as string) ?? ''
              );
              const existingValue = previewMessages.get(key)?.sent;
              const latestMessage = await fetchMostRecentMessage(
                convo,
                existingValue
              );
              countRef.current = countRef.current + 1;
              setProgress(
                Math.round((countRef.current / needsSync.length) * 100)
              );

              if (
                latestMessage &&
                (!existingValue || latestMessage.sent > existingValue)
              ) {
                return [key, latestMessage];
              }
            })
          )
        ).filter((m) => Boolean(m)) as [string, DecodedMessage][];

        await batchPersistPreviewMessages(new Map(batch));
      }
      setLoading(false);
      setHasSyncedMessages(true);
      loadingRef.current = false;
    };

    getMessagePreviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, conversations, currentProfile?.id]);

  useEffect(() => {
    setHasSyncedMessages(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, currentProfile?.id);

  return {
    loading,
    progress
  };
};

export default useGetMessagePreviews;
