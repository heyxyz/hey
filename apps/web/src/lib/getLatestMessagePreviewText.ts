import { MessageType } from '@pushprotocol/restapi/src/lib/constants';

import type { DisplayedMessage } from './mapReactionsToMessages';

export const getLatestMessagePreviewText = (message: DisplayedMessage) => {
  if (message.messageType === MessageType.TEXT) {
    return `Message: ${message.messageContent}`;
  }

  if (message.messageType === MessageType.REPLY) {
    return `Reply: ${(message.messageObj as any).content.messageObj.content}`;
  }

  if (message.messageType === MessageType.IMAGE) {
    return 'Image';
  }
};
