// import type { CachedConversation } from '@xmtp/react-sdk';

import ChatsView from '@components/Chat/ChatsView';
import MetaTags from '@components/Common/MetaTags';
import Loader from '@components/Shared/Loader';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import { APP_NAME } from '@hey/data/constants';
import { GridItemEight, GridLayout } from '@hey/ui';
import { useInitializedClient } from 'src/hooks/useInitializedClient';
import useProfileStore from 'src/store/persisted/useProfileStore';

// import { ContentTypeReaction } from '@xmtp/content-type-reaction';
// import { ContentTypeReadReceipt } from '@xmtp/content-type-read-receipt';
// import {
//   AddressInput,
//   ConversationList,
//   MessageInput,
//   Messages as MessagesList
// } from '@xmtp/react-components';
// import {
//   ContentTypeId,
//   useClient,
//   useConversations,
//   useMessages,
//   useSendMessage,
//   useStreamMessages,
// } from '@xmtp/react-sdk';
// import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// type ConversationMessagesProps = {
//   conversation: CachedConversation;
// };

// const Messages: React.FC<ConversationMessagesProps> = ({ conversation }) => {
//   const [isSending, setIsSending] = useState(false);
//   const messageInputRef = useRef<HTMLTextAreaElement>(null);
//   const { isLoading, messages } = useMessages(conversation);
//   const { client } = useClient();
//   useStreamMessages(conversation);
//   const { sendMessage } = useSendMessage();

//   const filteredMessages = useMemo(
//     () =>
//       messages.filter((message) => {
//         const contentType = ContentTypeId.fromString(message.contentType);
//         return (
//           // supported content types
//           message.content !== undefined &&
//           // not reactions
//           !contentType.sameAs(ContentTypeReaction) &&
//           // not read receipts
//           !contentType.sameAs(ContentTypeReadReceipt)
//         );
//       }),
//     [messages],
//   );

//   const handleSendMessage = useCallback(
//     async (message: string) => {
//       setIsSending(true);
//       await sendMessage(conversation, message);
//       setIsSending(false);
//       // ensure focus of input by waiting for a browser tick
//       setTimeout(() => messageInputRef.current?.focus(), 0);
//     },
//     [conversation, sendMessage],
//   );

//   useEffect(() => {
//     messageInputRef.current?.focus();
//   }, [conversation]);

//   return (
//     <>
//       <AddressInput
//         avatarUrlProps={{ address: conversation.peerAddress }}
//         value={conversation.peerAddress}
//       />
//       <MessagesList
//         clientAddress={client?.address}
//         conversation={conversation}
//         isLoading={isLoading}
//         messages={filteredMessages}
//       />
//       <div className="MessageInputWrapper">
//         <MessageInput
//           isDisabled={isSending}
//           onSubmit={handleSendMessage}
//           ref={messageInputRef}
//         />
//       </div>
//     </>
//   );
// };

// const ChatPage = () => {
//   const { conversations, isLoading } = useConversations();
//   return (
//     <ConversationList
//       conversations={previews}
//       isLoading={isLoading}
//       renderEmpty={<NoConversations />}
//     />
//   )
// }

const ChatPage = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);

  const { client, isLoading } = useInitializedClient();

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  if (!client || isLoading) {
    return (
      <div className="page-center flex-col">
        <Loader message="Creating Chat profile..." />
      </div>
    );
  }

  return (
    <GridLayout>
      <MetaTags title={`Chat • ${APP_NAME}`} />
      <GridItemEight>
        <ChatsView />
      </GridItemEight>
    </GridLayout>
  );
};

export default ChatPage;
// export default ChatPage;
