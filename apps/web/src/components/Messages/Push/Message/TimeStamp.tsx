import clsx from 'clsx';
import React from 'react';

import { dateToFromNowDaily } from '../helper';
import { MessageOrigin } from './Card';

interface TimestampProps {
  messageOrigin: MessageOrigin;
  timestamp: number;
}

const TimeStamp: React.FC<TimestampProps> = ({ messageOrigin, timestamp }) => {
  const timestampDate = dateToFromNowDaily(timestamp);
  return (
    <p
      className={clsx('my-1 text-xs text-gray-500', {
        'text-right': messageOrigin === MessageOrigin.Sender
      })}
    >
      {timestampDate}
    </p>
  );
};

export default TimeStamp;
