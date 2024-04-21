import type { ReactNode } from 'react';

import {
  TooltipContent,
  TooltipRoot,
  TooltipTrigger
} from 'prosekit/react/tooltip';

export default function Toggle({
  children,
  disabled,
  onClick,
  pressed,
  tooltip
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick?: VoidFunction;
  pressed: boolean;
  tooltip?: string;
}) {
  return (
    <TooltipRoot>
      <TooltipTrigger className="block">
        <button
          className="outline-unset focus-visible:outline-unset flex items-center justify-center rounded-md bg-transparent p-2 font-medium transition hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-900 disabled:pointer-events-none disabled:opacity-50 hover:disabled:opacity-50 data-[state=on]:bg-gray-200/60 dark:hover:bg-zinc-800 dark:focus-visible:ring-zinc-300 dark:data-[state=on]:bg-gray-700/60"
          data-state={pressed ? 'on' : 'off'}
          disabled={disabled}
          onClick={() => onClick?.()}
          onMouseDown={(event) => event.preventDefault()}
        >
          {children}
        </button>
      </TooltipTrigger>
      {tooltip && !disabled ? (
        <TooltipContent
          className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[state=open]:animate-duration-150 data-[state=closed]:animate-duration-200 data-[side=bottom]:slide-in-from-top-2 data-[side=bottom]:slide-out-to-top-2 data-[side=left]:slide-in-from-right-2 data-[side=left]:slide-out-to-right-2 data-[side=right]:slide-in-from-left-2 data-[side=right]:slide-out-to-left-2 data-[side=top]:slide-in-from-bottom-2 data-[side=top]:slide-out-to-bottom-2 z-50 overflow-hidden rounded-md border border-solid bg-zinc-900 px-3 py-1.5 text-xs text-zinc-50 shadow-sm will-change-transform dark:bg-zinc-50 dark:text-zinc-900"
          offset={4}
        >
          {tooltip}
        </TooltipContent>
      ) : null}
    </TooltipRoot>
  );
}
