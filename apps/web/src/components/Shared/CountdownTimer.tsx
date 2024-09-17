import type { FC } from "react";

import { useEffect, useState } from "react";

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
  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime() - 30000; // Subtract 30 seconds
    const timeDiff = target - now;

    if (timeDiff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
    const seconds = Math.floor((timeDiff / 1000) % 60);

    return { days, hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const formatTimeValue = (value: number, label: string): string => {
    return value > 0 ? `${value}${label} ` : "";
  };

  return (
    <span>
      {formatTimeValue(timeLeft.days, "d")}
      {formatTimeValue(timeLeft.hours, "h")}
      {formatTimeValue(timeLeft.minutes, "m")}
      {formatTimeValue(timeLeft.seconds, "s")}
    </span>
  );
};

export default CountdownTimer;
