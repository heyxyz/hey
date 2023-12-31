import React from 'react';

import { dateToFromNowDaily } from '../helper';

interface TimestampProps {
  timestamp: number;
}

const TimeStamp: React.FC<TimestampProps> = ({ timestamp }) => {
  const timestampDate = dateToFromNowDaily(timestamp);
  return <p className="text-xs text-gray-500">{timestampDate}</p>;
};

export default TimeStamp;
