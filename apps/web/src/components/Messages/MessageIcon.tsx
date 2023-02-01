import { MailIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import type { FC } from 'react';

const MessageIcon: FC = () => {
  // const currentProfile = useAppStore((state) => state.currentProfile);
  // const clearMessagesBadge = useMessagePersistStore((state) => state.clearMessagesBadge);
  // const viewedMessagesAtNs = useMessagePersistStore((state) => state.viewedMessagesAtNs);
  // const showMessagesBadge = useMessagePersistStore((state) => state.showMessagesBadge);
  // const setShowMessagesBadge = useMessagePersistStore((state) => state.setShowMessagesBadge);
  // const { client: cachedClient } = useXmtpClient(true);

  // const shouldShowBadge = (viewedAt: string | undefined, messageSentAt: Date | undefined): boolean => {
  //   if (!messageSentAt) {
  //     return false;
  //   }

  //   const viewedMessagesAt = fromNanoString(viewedAt);

  //   return (
  //     !viewedMessagesAt ||
  //     (viewedMessagesAt.getTime() < messageSentAt.getTime() && messageSentAt.getTime() < new Date().getTime())
  //   );
  // };

  // useEffect(() => {
  //   if (!cachedClient || !currentProfile) {
  //     return;
  //   }

  //   const matcherRegex = conversationMatchesProfile(currentProfile.id);

  //   const fetchShowBadge = async () => {
  //     const convos = await cachedClient.conversations.list();
  //     const matchingConvos = convos.filter(
  //       (convo) => convo.context?.conversationId && matcherRegex.test(convo.context.conversationId)
  //     );

  //     if (matchingConvos.length <= 0) {
  //       return;
  //     }

  //     const topics = matchingConvos.map((convo) => convo.topic);
  //     const mostRecentMessages = await cachedClient.listEnvelopes(topics, async (e) => e, {
  //       limit: 1,
  //       direction: SortDirection.SORT_DIRECTION_DESCENDING
  //     });
  //     const mostRecentMessage = mostRecentMessages.length > 0 ? mostRecentMessages[0] : null;
  //     const sentAt = fromNanoString(mostRecentMessage?.timestampNs);
  //     const showBadge = shouldShowBadge(viewedMessagesAtNs.get(currentProfile.id), sentAt);
  //     showMessagesBadge.set(currentProfile.id, showBadge);
  //     setShowMessagesBadge(new Map(showMessagesBadge));
  //   };

  //   let messageStream: AsyncGenerator<DecodedMessage>;
  //   const closeMessageStream = async () => {
  //     if (messageStream) {
  //       await messageStream.return(undefined); // eslint-disable-line unicorn/no-useless-undefined
  //     }
  //   };

  //   // For v1 badging, only badge when not already viewing messages. Once we have
  //   // badging per-conversation, we can remove this.
  //   const newMessageValidator = (profileId: string): boolean => {
  //     return !window.location.pathname.startsWith('/messages') && currentProfile.id === profileId;
  //   };

  //   const streamAllMessages = async (messageValidator: (profileId: string) => boolean) => {
  //     messageStream = await cachedClient.conversations.streamAllMessages();

  //     for await (const message of messageStream) {
  //       if (messageValidator(currentProfile.id)) {
  //         const conversationId = message.conversation.context?.conversationId;
  //         const isFromPeer = currentProfile.ownedBy !== message.senderAddress;
  //         if (isFromPeer && conversationId && matcherRegex.test(conversationId)) {
  //           const showBadge = shouldShowBadge(viewedMessagesAtNs.get(currentProfile.id), message.sent);
  //           showMessagesBadge.set(currentProfile.id, showBadge);
  //           setShowMessagesBadge(new Map(showMessagesBadge));
  //         }
  //       }
  //     }
  //   };

  //   fetchShowBadge();
  //   streamAllMessages(newMessageValidator);

  //   return () => {
  //     closeMessageStream();
  //   };

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [cachedClient, currentProfile?.id]);

  return (
    <Link
      href="/messages"
      className="hidden min-w-[40px] items-start justify-center rounded-md p-1 hover:bg-gray-300 hover:bg-opacity-20 md:flex"
      // onClick={() => {
      //   currentProfile && clearMessagesBadge(currentProfile.id);
      // }}
    >
      <MailIcon className="h-5 w-5 sm:h-6 sm:w-6" />
      {/* {showMessagesBadge.get(currentProfile?.id) ? (
        <span className="h-2 w-2 rounded-full bg-red-500" />
      ) : null} */}
    </Link>
  );
};

export default MessageIcon;
