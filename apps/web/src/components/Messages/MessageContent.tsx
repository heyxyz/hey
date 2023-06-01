import Markup from '@components/Shared/Markup';
import type { Profile } from '@lenster/lens';
import type { DecodedMessage } from '@xmtp/xmtp-js';
import type { FC } from 'react';
import { ContentTypeRemoteAttachment } from 'xmtp-content-type-remote-attachment';

import RemoteAttachmentPreview from './RemoteAttachmentPreview';

interface MessageContentProps {
  message: DecodedMessage;
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
