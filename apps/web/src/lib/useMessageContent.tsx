import type { ReactNode } from 'react';

import { Image } from '@hey/ui';
import { MessageType } from '@pushprotocol/restapi/src/lib/constants';

import type { DisplayedMessage } from './mapReactionsToMessages';

export const useMessageContent = (message: DisplayedMessage | null) => {
  const getMessageContent = (
    message: {
      messageObj: DisplayedMessage['messageObj'] | string;
      messageType: DisplayedMessage['messageType'] | string;
    } | null
  ): ReactNode => {
    if (!message) {
      return;
    }
    if (typeof message.messageObj === 'string') {
      return message.messageObj;
    }
    switch (message.messageType) {
      case MessageType.TEXT: {
        return message.messageObj.content as string;
      }
      case MessageType.IMAGE: {
        return (
          <Image
            height={50}
            src={message.messageObj.content as string}
            width={50}
          />
        );
      }

      case MessageType.REPLY: {
        if (typeof message.messageObj.content === 'string') {
          return message.messageObj.content;
        }
        return getMessageContent(
          message.messageObj.content as unknown as {
            messageObj: DisplayedMessage['messageObj'];
            messageType: DisplayedMessage['messageType'];
          }
        );
      }
    }
  };

  return getMessageContent(message);
};
