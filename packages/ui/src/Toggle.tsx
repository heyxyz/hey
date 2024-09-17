import type { FC } from "react";

import * as Switch from "@radix-ui/react-switch";

import cn from "../cn";

interface ToggleProps {
  disabled?: boolean;
  on: boolean;
  setOn: (on: boolean) => void;
}

export const Toggle: FC<ToggleProps> = ({ disabled = false, on, setOn }) => {
  return (
    <Switch.Root
      aria-label="Toggle"
      checked={on}
      className={cn(
        on ? "bg-black dark:bg-white" : "bg-gray-200 dark:bg-gray-500",
        disabled && "cursor-not-allowed opacity-50",
        "inline-flex h-[22px] w-[42.5px] min-w-[42.5px] rounded-full border-2 border-transparent outline-offset-4 transition-colors duration-200 ease-in-out"
      )}
      disabled={disabled}
      onCheckedChange={() => setOn(!on)}
    >
      <span
        className={cn(
          on ? "translate-x-5" : "translate-x-0",
          "pointer-events-none inline-block size-[18px] rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out dark:bg-black"
        )}
      />
    </Switch.Root>
  );
};
