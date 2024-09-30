import type { FC, ReactNode } from "react";
import cn from "../cn";
import { Card } from "./Card";

interface EmptyStateProps {
  hideCard?: boolean;
  icon: ReactNode;
  message: ReactNode;
  className?: string;
}

export const EmptyState: FC<EmptyStateProps> = ({
  hideCard = false,
  icon,
  message,
  className = ""
}) => {
  return (
    <Card
      className={cn(
        { "!bg-transparent !shadow-none border-0": hideCard },
        className
      )}
      forceRounded
    >
      <div className="grid justify-items-center space-y-2 p-5">
        <div>{icon}</div>
        <div>{message}</div>
      </div>
    </Card>
  );
};
