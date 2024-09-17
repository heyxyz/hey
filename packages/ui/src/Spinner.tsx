import type { FC } from "react";

import cn from "../cn";

interface SpinnerProps {
  className?: string;
  size?: "lg" | "md" | "sm" | "xs";
  variant?: "danger" | "primary" | "warning";
}

export const Spinner: FC<SpinnerProps> = ({
  className = "",
  size = "md",
  variant = "primary"
}) => {
  return (
    <div
      className={cn(
        {
          "border-gray-200 border-t-gray-600": variant === "primary",
          "border-red-200 border-t-red-600": variant === "danger",
          "border-yellow-200 border-t-yellow-600": variant === "warning",
          "size-10 border-4": size === "lg",
          "size-4 border-[2px]": size === "xs",
          "size-5 border-2": size === "sm",
          "size-8 border-[3px]": size === "md"
        },
        "animate-spin rounded-full",
        className
      )}
    />
  );
};
