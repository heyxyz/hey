import useXmtpClient from '@components/utils/hooks/useXmtpClient';
import { MailIcon } from '@heroicons/react/outline';
import conversationMatchesProfile from '@lib/conversationMatchesProfile';
import type { DecodedMessage } from '@xmtp/xmtp-js';
import { fromNanoString, SortDirection } from '@xmtp/xmtp-js';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { useMessagePersistStore } from 'src/store/message';

const MessageIcon: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { client: cachedClient } = useXmtpClient(true);
  const clearMessagesBadge = useMessagePersistStore((state) => state.clearMessagesBadge);
  const viewedMessagesAtNs = useMessagePersistStore((state) => state.viewedMessagesAtNs);
  const showMessagesBadge = useMessagePersistStore((state) => state.showMessagesBadge);
  const setShowMessagesBadge = useMessagePersistStore((state) => state.setShowMessagesBadge);
  const { pathname } = useRouter();
  const [isStreamClosing, setIsStreamClosing] = useState(false);

  // useEffect(() => {
  //   console.log('new pathname: ' + pathname);
  //   setCurrentPath(pathname);
  // }, [pathname]);

  const shouldShowBadge = (viewedAt: string | undefined, messageSentAt: Date | undefined): boolean => {
    if (!messageSentAt) {
      return false;
    }

    const viewedMessagesAt = fromNanoString(viewedAt);
    return (
      !viewedMessagesAt ||
      (viewedMessagesAt.getTime() < messageSentAt.getTime() && messageSentAt.getTime() < new Date().getTime())
    );
  };

  useEffect(() => {
    if (!cachedClient || !currentProfile || isStreamClosing) {
      return;
    }

    const matcherRegex = conversationMatchesProfile(currentProfile.id);

    const fetchShowBadge = async () => {
      if (pathname.startsWith('/messages')) {
        // For v1 badging, only badge when not already viewing messages. Once we have
        // badging per-conversation, we can remove this.
        clearMessagesBadge(currentProfile.id);
        // console.log('cleared messages tab fetch');
        return;
      }
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
      const showBadge = shouldShowBadge(viewedMessagesAtNs.get(currentProfile.id), sentAt);
      showMessagesBadge.set(currentProfile.id, showBadge);
      // console.log('fetch show badge ' + showBadge);
      setShowMessagesBadge(new Map(showMessagesBadge));
    };

    let messageStream: AsyncGenerator<DecodedMessage>;
    const closeMessageStream = async () => {
      if (messageStream) {
        setIsStreamClosing(true);
        console.log('close stream start');
        await messageStream.return(undefined); // eslint-disable-line unicorn/no-useless-undefined
        console.log('close stream end');
        setIsStreamClosing(false);
      }
    };

    const streamAllMessages = async () => {
      console.log('new stream for path: ' + pathname);
      messageStream = await cachedClient.conversations.streamAllMessages();

      for await (const message of messageStream) {
        if (!isStreamClosing && !pathname.startsWith('/messages')) {
          console.log('NEW MSG! from stream path: ' + pathname + ' ' + isStreamClosing);
          const conversationId = message.conversation.context?.conversationId;
          const isFromPeer = currentProfile.ownedBy !== message.senderAddress;
          if (isFromPeer && conversationId && matcherRegex.test(conversationId)) {
            const showBadge = shouldShowBadge(viewedMessagesAtNs.get(currentProfile.id), message.sent);
            showMessagesBadge.set(currentProfile.id, showBadge);
            // console.log('stream show badge: ' + currentProfile.handle + ' : ' + showBadge);
            setShowMessagesBadge(new Map(showMessagesBadge));
          }
        } else {
          // For v1 badging, only badge when not already viewing messages. Once we have
          // badging per-conversation, we can remove this.
          clearMessagesBadge(currentProfile.id);
          // console.log('cleared messages tab stream ' + currentProfile.handle);
        }
      }
    };

    fetchShowBadge();
    streamAllMessages();

    return () => {
      closeMessageStream();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cachedClient, currentProfile?.id, pathname, setIsStreamClosing]);

  // useEffect(() => {
  //   if (!currentProfile) {
  //     return;
  //   }

  //   console.log('show for prof: ' + currentProfile.handle + showMessagesBadge.get(currentProfile.id));
  //   setBadgeForProfile(showMessagesBadge.get(currentProfile.id) || false);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentProfile, showMessagesBadge]);

  // console.log(
  //   'show badge: ' + showMessagesBadge.get(currentProfile?.id) + ' ' + currentProfile?.handle
  // );

  return (
    <Link
      href="/messages"
      className="flex items-start justify-center rounded-md hover:bg-gray-300 p-1 hover:bg-opacity-20 min-w-[40px]"
      onClick={() => {
        currentProfile && clearMessagesBadge(currentProfile.id);
      }}
    >
      <MailIcon className="w-5 h-5 sm:w-6 sm:h-6" />
      {showMessagesBadge.get(currentProfile?.id) && <span className="w-2 h-2 bg-red-500 rounded-full" />}
    </Link>
  );
};

export default MessageIcon;
