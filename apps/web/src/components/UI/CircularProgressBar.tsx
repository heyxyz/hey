import type { FC } from 'react';

interface Props {
  value: number;
  label: string;
}

const CircularProgressBar: FC<Props> = ({ value, label }) => {
  const strokeWidth = 6;
  const radius = 50 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = value / 100;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="relative rounded-full h-8 w-8">
      <svg viewBox="0 0 100 100">
        <circle
          className="stroke-current text-gray-200"
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          strokeWidth={strokeWidth}
        />
        <circle
          className="stroke-current text-pink-500"
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-pink-500 text-xs font-medium">{label}</span>
      </div>
    </div>
  );
};

export default CircularProgressBar;
