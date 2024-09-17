import type { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";

import { forwardRef } from "react";

import cn from "../cn";

interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  icon?: ReactNode;
  outline?: boolean;
  size?: "lg" | "md" | "sm";
  variant?: "danger" | "primary";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      children,
      className = "",
      disabled = false,
      icon,
      outline,
      size = "md",
      variant = "primary",
      ...rest
    },
    ref
  ) {
    const nonOutlineTextStyles = !outline && {
      "text-white dark:text-black":
        variant === "primary" || variant === "danger"
    };

    const nonOutlineBgStyles = !outline && {
      "bg-black hover:bg-gray-800 active:bg-gray-700": variant === "primary",
      "bg-red-500 hover:bg-red-800 active:bg-red-700": variant === "danger",
      "dark:bg-red-500 dark:hover:bg-red-800 dark:active:bg-red-700":
        variant === "danger",
      "dark:bg-white dark:hover:bg-gray-100 dark:active:bg-gray-200":
        variant === "primary"
    };

    const nonOutlineBorderStyles = !outline && {
      "border border-black hover:border-gray-800 active:border-gray-700":
        variant === "primary",
      "border border-red-500 hover:border-red-800 active:border-red-700":
        variant === "danger",
      "dark:border-red-500 dark:hover:border-red-800 dark:active:border-red-700":
        variant === "danger",
      "dark:border-white dark:hover:border-gray-100 dark:active:border-gray-200":
        variant === "primary"
    };

    const nonOutlineDisabledStyles = !outline &&
      disabled && {
        "dark:text-gray-500 dark:hover:bg-white dark:hover:border-white dark:active:bg-white dark:active:border-white dark:border-white":
          variant === "primary",
        "dark:text-red-900 dark:hover:bg-red-500 dark:hover:border-red-500 dark:active:bg-red-500 dark:active:border-red-500 dark:border-red-500":
          variant === "danger",
        "text-gray-200 hover:bg-black hover:border-black active:bg-black active:border-black border-black":
          variant === "primary",
        "text-red-200 hover:bg-red-500 hover:border-red-500 active:bg-red-500 active:border-red-500 border-red-500":
          variant === "danger"
      };

    const outlineTextStyles = outline && {
      "text-black dark:text-white": variant === "primary",
      "text-red-500 hover:text-red-400": variant === "danger"
    };

    const outlineBorderStyles = outline && {
      "border border-gray-300 dark:border-white hover:border-gray-500":
        variant === "primary",
      "border border-red-600 hover:border-red-400": variant === "danger"
    };

    const outlineDisabledStyles = outline &&
      disabled && {
        "text-gray-600 hover:border-gray-300": variant === "primary",
        "text-red-400 hover:text-red-400 hover:border-red-400 border-red-400":
          variant === "danger"
      };

    const sizeStyles = {
      "px-3 py-0.5 text-sm": size === "sm",
      "px-4 py-1": size === "md",
      "px-5 py-1.5": size === "lg"
    };

    return (
      <button
        className={cn(
          {
            ...nonOutlineTextStyles,
            ...nonOutlineBgStyles,
            ...nonOutlineBorderStyles,
            ...nonOutlineDisabledStyles,
            ...outlineTextStyles,
            ...outlineBorderStyles,
            ...outlineDisabledStyles,
            ...sizeStyles,
            "inline-flex items-center space-x-1.5": icon && children
          },
          "rounded-full font-bold outline-2 outline-offset-4",
          className
        )}
        disabled={disabled}
        ref={ref}
        type={rest.type}
        {...rest}
      >
        {icon ? icon : null}
        <div>{children}</div>
      </button>
    );
  }
);
