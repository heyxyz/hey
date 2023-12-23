import type { DisplayedMessage } from '@lib/mapReactionsToMessages';

import { Image } from '@hey/ui';
import { MessageType } from '@pushprotocol/restapi/src/lib/constants';

const RenderMessage = ({ message }: { message: DisplayedMessage }) => {
  if (message.messageType === MessageType.TEXT) {
    return message.messageContent;
  }

  if (message.messageType === MessageType.IMAGE) {
    return <Image alt="" src={message.messageContent} />;
  }
};

export default RenderMessage;
