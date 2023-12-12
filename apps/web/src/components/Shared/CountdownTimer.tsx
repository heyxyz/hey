import type { FC } from 'react';

import { useEffect, useState } from 'react';

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

interface CountdownTimerProps {
  targetDate: string;
}

const CountdownTimer: FC<CountdownTimerProps> = ({ targetDate }) => {
  const getTimeLeft = (): TimeLeft => {
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime() - 30000; // Subtract 30 seconds
    const timeDiff = target - now;

    if (timeDiff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const seconds = Math.floor((timeDiff / 1000) % 60);
    const minutes = Math.floor((timeDiff / 1000 / 60) % 60);
    const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    return {
      days,
      hours,
      minutes,
      seconds
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatTimeValue = (value: number, label: string): string => {
    if (value === 0) {
      return '';
    }
    return `${value}${label} `;
  };

  return (
    <span>
      {formatTimeValue(timeLeft.days, 'd')}
      {formatTimeValue(timeLeft.hours, 'h')}
      {formatTimeValue(timeLeft.minutes, 'm')}
      {formatTimeValue(timeLeft.seconds, 's')}
    </span>
  );
};

export default CountdownTimer;
