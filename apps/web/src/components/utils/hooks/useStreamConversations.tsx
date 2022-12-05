import { buildConversationKey } from '@lib/conversationKey';
import conversationMatchesProfile from '@lib/conversationMatchesProfile';
import type { Conversation, Stream } from '@xmtp/xmtp-js';
import { useEffect } from 'react';
import { useAppStore } from 'src/store/app';
import { useMessageStore } from 'src/store/message';

import useXmtpClient from './useXmtpClient';

const useStreamConversations = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const conversations = useMessageStore((state) => state.conversations);
  const setConversations = useMessageStore((state) => state.setConversations);
  const { client } = useXmtpClient();

  useEffect(() => {
    if (!client || !currentProfile) {
      return;
    }
    let conversationStream: Stream<Conversation>;
    const closeConversationStream = async () => {
      if (!conversationStream) {
        return;
      }
      await conversationStream.return();
    };
    const streamConversations = async () => {
      closeConversationStream();
      conversationStream = (await client?.conversations?.stream()) || [];
      const matcherRegex = conversationMatchesProfile(currentProfile?.id);
      for await (const convo of conversationStream) {
        // Ignore any new conversations not matching the current profile
        if (!convo.context?.conversationId || !matcherRegex.test(convo.context.conversationId)) {
          continue;
        }
        const newConversations = new Map(conversations);
        const key = buildConversationKey(convo.peerAddress, convo.context.conversationId);
        newConversations.set(key, convo);
        setConversations(newConversations);
      }
    };
    streamConversations();
    return () => {
      closeConversationStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, currentProfile]);
};

export default useStreamConversations;
