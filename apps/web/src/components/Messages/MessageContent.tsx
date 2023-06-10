import Markup from '@components/Shared/Markup';
import {
  type FailedMessage,
  isQueuedMessage,
  type PendingMessage
} from '@components/utils/hooks/useSendOptimisticMessage';
import type { Profile } from '@lenster/lens';
import type { DecodedMessage } from '@xmtp/xmtp-js';
import type { FC } from 'react';
import { ContentTypeRemoteAttachment } from 'xmtp-content-type-remote-attachment';

import RemoteAttachmentPreview from './RemoteAttachmentPreview';

interface MessageContentProps {
  message: DecodedMessage | PendingMessage | FailedMessage;
  profile: Profile | undefined;
  sentByMe: boolean;
}

const MessageContent: FC<MessageContentProps> = ({
  message,
  profile,
  sentByMe
}) => {
  if (message.error) {
    return <span>Error: {`${message.error}`}</span>;
  }

  // if message is pending, render a custom preview if available
  if (isQueuedMessage(message) && message.render) {
    return message.render();
  }

  if (message.contentType.sameAs(ContentTypeRemoteAttachment)) {
    return (
      <RemoteAttachmentPreview
        remoteAttachment={message.content}
        profile={profile}
        sentByMe={sentByMe}
      />
    );
  }

  return <Markup>{message.content}</Markup>;
};

export default MessageContent;
