import type { IMessageIPFSWithCID } from '@pushprotocol/restapi';

import React from 'react';

interface ReplyCardProps {
  chat: IMessageIPFSWithCID;
  handle: string;
}

const ReplyMessage: React.FC<ReplyCardProps> = ({ chat, handle }) => {
  return (
    <div className="relative flex flex-row overflow-hidden rounded-lg bg-gray-300 p-4">
      <div className="bg-brand-500 absolute left-0 top-0 h-full w-1.5" />
      <div className="flex flex-col">
        <span className="text-brand-500 font-medium">{handle}</span>
        <span className="text-sm">
          {typeof chat.messageObj === 'string'
            ? chat.messageObj
            : (chat.messageObj?.content as string)}
        </span>
      </div>
    </div>
  );
};

export default ReplyMessage;
