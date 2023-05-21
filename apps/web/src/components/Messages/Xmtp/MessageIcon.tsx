import useXmtpClient from '@components/utils/hooks/useXmtpClient';
import { MailIcon } from '@heroicons/react/outline';
import type { DecodedMessage } from '@xmtp/xmtp-js';
import { fromNanoString, SortDirection } from '@xmtp/xmtp-js';
import Link from 'next/link';
import type { FC } from 'react';
import { useEffect } from 'react';
import { useAppStore } from 'src/store/app';
import { useXmtpMessagePersistStore } from 'src/store/xmtp-message';

const MessageIcon: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const clearMessagesBadge = useXmtpMessagePersistStore(
    (state) => state.clearMessagesBadge
  );
  const viewedMessagesAtNs = useXmtpMessagePersistStore(
    (state) => state.viewedMessagesAtNs
  );
  const showMessagesBadge = useXmtpMessagePersistStore(
    (state) => state.showMessagesBadge
  );
  const setShowMessagesBadge = useXmtpMessagePersistStore(
    (state) => state.setShowMessagesBadge
  );
  const { client: cachedClient } = useXmtpClient(true);

  const shouldShowBadge = (
    viewedAt: string | undefined,
    messageSentAt: Date | undefined
  ): boolean => {
    if (!messageSentAt) {
      return false;
    }

    const viewedMessagesAt = fromNanoString(viewedAt);

    return (
      !viewedMessagesAt ||
      (viewedMessagesAt.getTime() < messageSentAt.getTime() &&
        messageSentAt.getTime() < new Date().getTime())
    );
  };

  useEffect(() => {
    if (!cachedClient || !currentProfile) {
      return;
    }

    const fetchShowBadge = async () => {
      const convos = await cachedClient.conversations.list();

      if (convos.length <= 0) {
        return;
      }

      const topics = convos.map((convo) => convo.topic);
      const queryResults = await cachedClient.apiClient.batchQuery(
        topics.map((topic) => ({
          contentTopic: topic,
          pageSize: 1,
          direction: SortDirection.SORT_DIRECTION_DESCENDING
        }))
      );
      const mostRecentTimestamp = queryResults.reduce(
        (lastTimestamp: string | null, envelopes) => {
          if (!envelopes.length || !envelopes[0]?.timestampNs) {
            return lastTimestamp;
          }
          if (!lastTimestamp || envelopes[0]?.timestampNs > lastTimestamp) {
            return envelopes[0].timestampNs;
          }
          return lastTimestamp;
        },
        null
      );
      // No messages have been sent or received by the user, ever
      const sentAt = fromNanoString(mostRecentTimestamp ?? undefined);
      const showBadge = shouldShowBadge(
        viewedMessagesAtNs.get(currentProfile.id),
        sentAt
      );
      showMessagesBadge.set(currentProfile.id, showBadge);
      setShowMessagesBadge(new Map(showMessagesBadge));
    };

    let messageStream: AsyncGenerator<DecodedMessage>;
    const closeMessageStream = async () => {
      if (messageStream) {
        await messageStream.return(undefined); // eslint-disable-line unicorn/no-useless-undefined
      }
    };

    // For v1 badging, only badge when not already viewing messages. Once we have
    // badging per-conversation, we can remove this.
    const newMessageValidator = (profileId: string): boolean => {
      return (
        !window.location.pathname.startsWith('/messages') &&
        currentProfile.id === profileId
      );
    };

    const streamAllMessages = async (
      messageValidator: (profileId: string) => boolean
    ) => {
      messageStream = await cachedClient.conversations.streamAllMessages();

      for await (const message of messageStream) {
        if (messageValidator(currentProfile.id)) {
          const isFromPeer = currentProfile.ownedBy !== message.senderAddress;
          if (isFromPeer) {
            const showBadge = shouldShowBadge(
              viewedMessagesAtNs.get(currentProfile.id),
              message.sent
            );
            showMessagesBadge.set(currentProfile.id, showBadge);
            setShowMessagesBadge(new Map(showMessagesBadge));
          }
        }
      }
    };

    fetchShowBadge();
    streamAllMessages(newMessageValidator);

    return () => {
      closeMessageStream();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cachedClient, currentProfile?.id]);

  return (
    <Link
      href="/messages"
      className="hidden min-w-[40px] items-start justify-center rounded-md p-1 hover:bg-gray-300/20 md:flex"
      onClick={() => {
        currentProfile && clearMessagesBadge(currentProfile.id);
      }}
    >
      <MailIcon className="h-5 w-5 sm:h-6 sm:w-6" />
      {showMessagesBadge.get(currentProfile?.id) ? (
        <span className="h-2 w-2 rounded-full bg-red-500" />
      ) : null}
    </Link>
  );
};

export default MessageIcon;
