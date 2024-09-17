import type { ElementType, FC, MouseEvent, ReactNode } from "react";

import cn from "../cn";

interface CardProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  forceRounded?: boolean;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

export const Card: FC<CardProps> = ({
  as: Tag = "div",
  children,
  className = "",
  forceRounded = false,
  onClick
}) => {
  return (
    <Tag
      className={cn(
        forceRounded
          ? "rounded-xl"
          : "rounded-none border-x-0 sm:rounded-xl sm:border-x",
        "border bg-white dark:border-gray-700 dark:bg-black",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Tag>
  );
};
