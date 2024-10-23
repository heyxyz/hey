import type { FC } from "react";

interface ProgressBarProps {
  max: number;
  value: number;
}

export const ProgressBar: FC<ProgressBarProps> = ({ max, value }) => (
  <div className="w-full rounded-full bg-gray-200">
    <div
      className="h-2.5 rounded-full bg-black"
      style={{ width: `${(value / max) * 100}%` }}
    />
  </div>
);
