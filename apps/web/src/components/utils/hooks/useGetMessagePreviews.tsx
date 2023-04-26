import useXmtpClient from '@components/utils/hooks/useXmtpClient';
import chunkArray from '@lib/chunkArray';
import { buildConversationKey } from '@lib/conversationKey';
import type { Conversation } from '@xmtp/xmtp-js';
import { SortDirection } from '@xmtp/xmtp-js';
import type { DecodedMessage } from '@xmtp/xmtp-js/dist/types/src/Message';
import { useEffect, useRef, useState } from 'react';
import { useMessageStore } from 'src/store/message';

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
  const setPreviewMessage = useMessageStore((state) => state.setPreviewMessage);
  const { client } = useXmtpClient();
  const [loading, setLoading] = useState<boolean>(false);
  const loadingRef = useRef<boolean>(false);
  const countRef = useRef<number>(0);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (!client || loadingRef.current) {
      return;
    }

    const getMessagePreviews = async () => {
      loadingRef.current = true;
      setLoading(true);

      // Diff the conversations and preview messages to see which ones are missing
      const needsSync = Array.from(conversations.values()).filter(
        (convo) =>
          previewMessages.get(
            buildConversationKey(convo.peerAddress, convo.context?.conversationId as string)
          ) === undefined
      );

      for (const chunk of chunkArray(needsSync, 50)) {
        // Yield to the UI between pages of conversations, since this all happens in the background
        await new Promise((resolve) => requestAnimationFrame(resolve));
        await Promise.all(
          chunk.map(async (convo) => {
            const latestMessage = await fetchMostRecentMessage(convo);
            const existingValue = previewMessages.get(latestMessage.key)?.sent;
            if (latestMessage.message && (!existingValue || latestMessage?.message.sent > existingValue)) {
              setPreviewMessage(latestMessage.key, latestMessage.message);
            }
            countRef.current = countRef.current + 1;
            setProgress(Math.round((countRef.current / needsSync.length) * 100));
          })
        );
      }

      setLoading(false);
      loadingRef.current = false;
    };

    getMessagePreviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, conversations, previewMessages]);

  return {
    loading,
    progress
  };
};

export default useGetMessagePreviews;
