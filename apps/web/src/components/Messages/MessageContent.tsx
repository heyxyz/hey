import Markup from '@components/Shared/Markup';
import type { DecodedMessage } from '@xmtp/xmtp-js';
import type { Profile } from 'lens';
import { ContentTypeRemoteAttachment } from 'xmtp-content-type-remote-attachment';

import RemoteAttachmentPreview from './RemoteAttachmentPreview';

type MessageContentProps = {
  message: DecodedMessage;
  profile: Profile | undefined;
  sentByMe: boolean;
};

const MessageContent = ({
  message,
  profile,
  sentByMe
}: MessageContentProps): JSX.Element => {
  function content(): JSX.Element {
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
    } else {
      return <Markup>{message.content}</Markup>;
    }
  }

  return content();
};

export default MessageContent;
