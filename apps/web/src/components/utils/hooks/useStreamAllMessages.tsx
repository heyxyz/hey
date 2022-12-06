import useXmtpClient from '@components/utils/hooks/useXmtpClient';
import { buildConversationKey } from '@lib/conversationKey';
import conversationMatchesProfile from '@lib/conversationMatchesProfile';
import type { DecodedMessage } from '@xmtp/xmtp-js/dist/types/src/Message';
import { useEffect } from 'react';
import { useAppStore } from 'src/store/app';
import { useMessageStore } from 'src/store/message';

const useStreamAllMessages = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setPreviewMessage = useMessageStore((state) => state.setPreviewMessage);
  const { client } = useXmtpClient();
  const addMessages = useMessageStore((state) => state.addMessages);

  useEffect(() => {
    if (!client || !currentProfile) {
      return;
    }
    const matcherRegex = conversationMatchesProfile(currentProfile.id);
    let messageStream: AsyncGenerator<DecodedMessage>;

    const streamAllMessages = async () => {
      messageStream = await client.conversations.streamAllMessages();

      for await (const message of messageStream) {
        const conversationId = message.conversation.context?.conversationId;
        if (conversationId && matcherRegex.test(conversationId)) {
          const key = buildConversationKey(message.conversation.peerAddress, conversationId);
          setPreviewMessage(key, message);
          addMessages(key, [message]);
        }
      }
    };

    const closeMessageStream = async () => {
      if (messageStream) {
        await messageStream.return(undefined); // eslint-disable-line unicorn/no-useless-undefined
      }
    };

    streamAllMessages();

    return () => {
      closeMessageStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, currentProfile]);
};

export default useStreamAllMessages;
