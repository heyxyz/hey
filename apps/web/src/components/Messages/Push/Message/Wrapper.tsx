import type { ReactNode } from 'react';

import clsx from 'clsx';
import React from 'react';

import { MessageOrigin } from './Card';

interface MessageWrapperProps {
  children: ReactNode;
  isAttachment: boolean;
  messageOrigin: MessageOrigin;
}

export const MessageWrapper: React.FC<MessageWrapperProps> = ({
  children,
  isAttachment,
  messageOrigin
}) => {
  return (
    <div
      className={clsx('relative w-fit max-w-fit font-medium', {
        'border py-3 pl-4 pr-[50px]': !isAttachment,
        'rounded-xl rounded-tl-sm': messageOrigin === MessageOrigin.Sender,
        'rounded-xl rounded-tr-sm bg-violet-500':
          messageOrigin === MessageOrigin.Receiver
      })}
    >
      {children}
    </div>
  );
};
