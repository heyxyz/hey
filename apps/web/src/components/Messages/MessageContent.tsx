import Markup from '@components/Shared/Markup';
import {
  type FailedMessage,
  isQueuedMessage,
  type PendingMessage
} from '@components/utils/hooks/useSendOptimisticMessage';
import type { Profile } from '@lenster/lens';
import type { DecodedMessage } from '@xmtp/xmtp-js';
import type { FC, ReactNode } from 'react';
import { useRef } from 'react';
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
  const previewRef = useRef<ReactNode | undefined>();

  if (message.error) {
    return <span>Error: {`${message.error}`}</span>;
  }

  const hasQueuedMessagePreview = isQueuedMessage(message);

  // if message is pending, render a custom preview if available
  if (hasQueuedMessagePreview && message.render) {
    if (!previewRef.current) {
      // store the message preview so that RemoteAttachmentPreview
      // has access to it
      previewRef.current = message.render;
    }
    return previewRef.current;
  }

  if (message.contentType.sameAs(ContentTypeRemoteAttachment)) {
    return (
      <RemoteAttachmentPreview
        remoteAttachment={message.content}
        profile={profile}
        sentByMe={sentByMe}
        preview={previewRef.current}
      />
    );
  }

  return <Markup>{message.content}</Markup>;
};

export default MessageContent;
