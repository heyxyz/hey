import type { DisplayedMessage } from '@lib/mapReactionsToMessages';

import { MessageType } from '@pushprotocol/restapi/src/lib/constants';

const RenderReplyMessage = ({
  message
}: {
  message: DisplayedMessage & {
    messageObj: {
      content: {
        messageObj: {
          content: string;
        };
        messageType: string;
      };
      reference: string;
    };
  };
}) => {
  if (message.messageType !== MessageType.REPLY) {
    return null;
  }

  if (typeof message.messageObj !== 'object') {
    return null;
  }

  if (message.messageObj.content.messageType === MessageType.TEXT) {
    return (
      <>
        <div className="rounded bg-gray-200 p-1.5 text-gray-900">
          <span className="block text-sm font-bold">Replied To:</span>
          {message.parentMessage?.messageContent}
        </div>
        {message.messageObj.content.messageObj.content}
      </>
    );
  }
};

export default RenderReplyMessage;
