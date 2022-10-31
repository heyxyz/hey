import useXmtpClient from '@components/utils/hooks/useXmtpClient';
import { MailIcon } from '@heroicons/react/outline';
import conversationMatchesProfile from '@lib/conversationMatchesProfile';
import { fetchMostRecentMessage } from '@lib/fetchMostRecentMessage';
import type { DecodedMessage } from '@xmtp/xmtp-js';
import Link from 'next/link';
import type { FC } from 'react';
import { useEffect } from 'react';
import { useAppPersistStore, useAppStore } from 'src/store/app';

const MessageIcon: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { client: cachedClient } = useXmtpClient(true);
  const clearMessagesBadge = useAppPersistStore((state) => state.clearMessagesBadge);
  const lastViewedMessagesAt = useAppPersistStore((state) =>
    state.lastViewedMessagesAt ? new Date(state.lastViewedMessagesAt) : null
  );
  const showUnreadMessages = useAppPersistStore((state) => state.showUnreadMessages);
  const setShowUnreadMessages = useAppPersistStore((state) => state.setShowUnreadMessages);

  const showBadge = (mostRecentMessage: DecodedMessage | undefined): boolean => {
    if (!mostRecentMessage) {
      return false;
    }
    return !lastViewedMessagesAt || lastViewedMessagesAt.getTime() < mostRecentMessage.sent.getTime();
  };

  useEffect(() => {
    if (!cachedClient || !currentProfile) {
      return;
    }

    const matcherRegex = conversationMatchesProfile(currentProfile.id);

    const fetchShowBadge = async () => {
      const convos = await cachedClient.conversations.list();
      const matchingConvos = convos.filter(
        (convo) => convo.context?.conversationId && matcherRegex.test(convo.context.conversationId)
      );
      if (matchingConvos.length <= 0) {
        return;
      }

      const previews = await Promise.all(matchingConvos.map(fetchMostRecentMessage));
      previews.sort((a, b) => (b.message?.sent?.getTime() || 0) - (a.message?.sent?.getTime() || 0));
      const mostRecentMessage = previews.find((preview) => preview?.message?.sent)?.message;
      setShowUnreadMessages(showBadge(mostRecentMessage));
    };

    let messageStream: AsyncGenerator<DecodedMessage>;
    const closeMessageStream = async () => {
      if (messageStream) {
        await messageStream.return(undefined); // eslint-disable-line unicorn/no-useless-undefined
      }
    };

    const streamAllMessages = async () => {
      messageStream = await cachedClient.conversations.streamAllMessages();

      for await (const message of messageStream) {
        const conversationId = message.conversation.context?.conversationId;
        const isFromPeer = currentProfile.ownedBy !== message.senderAddress;
        if (isFromPeer && conversationId && matcherRegex.test(conversationId)) {
          setShowUnreadMessages(showBadge(message));
        }
      }
    };

    fetchShowBadge();
    streamAllMessages();

    return () => {
      closeMessageStream();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cachedClient]);

  return (
    <Link
      href="/messages"
      className="flex items-start rounded-md hover:bg-gray-300 p-1 hover:bg-opacity-20"
      onClick={() => {
        clearMessagesBadge();
      }}
    >
      <MailIcon className="w-5 h-5 sm:w-6 sm:h-6" />
      <span className={`w-2 h-2 bg-red-500 rounded-full ${showUnreadMessages ? 'visible' : 'invisible'}`} />
    </Link>
  );
};

export default MessageIcon;
