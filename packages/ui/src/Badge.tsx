import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

import { forwardRef } from "react";

import cn from "../cn";

interface BadgeProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  size?: "lg" | "md" | "sm";
  variant?: "brand" | "danger" | "primary" | "secondary" | "warning";
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(function Badge(
  { children, className, size = "sm", variant = "primary", ...rest },
  ref
) {
  const variantStyles = {
    "border-black bg-black": variant === "primary",
    "border-brand-600 bg-brand-500": variant === "brand",
    "border-gray-600 bg-gray-500": variant === "secondary",
    "border-red-600 bg-red-500": variant === "danger",
    "border-yellow-600 bg-yellow-500": variant === "warning"
  };

  const sizeStyles = {
    "px-2": size === "sm",
    "px-2 py-0.5": size === "md",
    "px-2.5 py-1": size === "lg"
  };

  return (
    <span
      className={cn(
        variantStyles,
        sizeStyles,
        className,
        "rounded-md border text-white text-xs shadow-sm"
      )}
      {...rest}
      ref={ref}
    >
      {children}
    </span>
  );
});
