import Markup from '@components/Shared/Markup';
import type { DecodedMessage } from '@xmtp/xmtp-js';
import { ContentTypeRemoteAttachment } from 'xmtp-content-type-remote-attachment';

import RemoteAttachmentPreview from './RemoteAttachmentPreview';

type MessageContentProps = {
  message: DecodedMessage;
};

function contentFor(message: DecodedMessage): JSX.Element {
  if (message.error) {
    return <span>{`Error: ${message.error}`}</span>;
  }

  if (message.contentType.sameAs(ContentTypeRemoteAttachment)) {
    return <RemoteAttachmentPreview remoteAttachment={message.content} />;
  } else {
    return <Markup>{message.content}</Markup>;
  }
}

const MessageContent = ({ message }: MessageContentProps): JSX.Element => {
  return contentFor(message);
};

export default MessageContent;
