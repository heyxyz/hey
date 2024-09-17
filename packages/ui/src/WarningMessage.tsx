import type { FC, ReactNode } from "react";

import cn from "../cn";

interface WarningMessageProps {
  className?: string;
  message?: ReactNode;
  title?: string;
}

export const WarningMessage: FC<WarningMessageProps> = ({
  className = "",
  message,
  title
}) => {
  if (!message) {
    return null;
  }

  return (
    <div
      className={cn(
        "space-y-1 rounded-xl border-2 border-yellow-500/50 bg-yellow-50 p-4 dark:bg-yellow-900/10",
        className
      )}
    >
      {title ? (
        <h3 className="font-medium text-sm text-yellow-800 dark:text-yellow-200">
          {title}
        </h3>
      ) : null}
      <div className="text-sm text-yellow-700 dark:text-yellow-200">
        {message}
      </div>
    </div>
  );
};
