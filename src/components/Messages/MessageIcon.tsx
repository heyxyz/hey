import useXmtpClient from '@components/utils/hooks/useXmtpClient';
import { MailIcon } from '@heroicons/react/outline';
import conversationMatchesProfile from '@lib/conversationMatchesProfile';
import type { DecodedMessage } from '@xmtp/xmtp-js';
import { fromNanoString, SortDirection } from '@xmtp/xmtp-js';
import Link from 'next/link';
import type { FC } from 'react';
import { useEffect } from 'react';
import { useAppPersistStore, useAppStore } from 'src/store/app';

const MessageIcon: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { client: cachedClient } = useXmtpClient(true);
  const clearMessagesBadge = useAppPersistStore((state) => state.clearMessagesBadge);
  const viewedMessagesAtNs = useAppPersistStore((state) => state.viewedMessagesAtNs);
  const showMessagesBadge = useAppPersistStore((state) => state.showMessagesBadge);
  const setShowMessagesBadge = useAppPersistStore((state) => state.setShowMessagesBadge);

  const shouldShowBadge = (messageSentAt: Date | undefined): boolean => {
    if (!messageSentAt) {
      return false;
    }

    const viewedMessagesAt = fromNanoString(viewedMessagesAtNs);
    return (
      !viewedMessagesAt ||
      (viewedMessagesAt.getTime() < messageSentAt.getTime() && messageSentAt.getTime() < new Date().getTime())
    );
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

      const topics = matchingConvos.map((convo) => convo.topic);
      const mostRecentMessages = await cachedClient.listEnvelopes(topics, async (e) => e, {
        limit: 1,
        direction: SortDirection.SORT_DIRECTION_DESCENDING
      });
      const mostRecentMessage = mostRecentMessages.length > 0 ? mostRecentMessages[0] : null;
      const sentAt = fromNanoString(mostRecentMessage?.timestampNs);
      setShowMessagesBadge(shouldShowBadge(sentAt));
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
          setShowMessagesBadge(shouldShowBadge(message.sent));
        }
      }
    };

    console.log('fetch home');
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
      <span className={`w-2 h-2 bg-red-500 rounded-full ${showMessagesBadge ? 'visible' : 'invisible'}`} />
    </Link>
  );
};

export default MessageIcon;
