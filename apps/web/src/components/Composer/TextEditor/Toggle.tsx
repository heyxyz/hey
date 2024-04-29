import type { ReactNode } from 'react';

import { Tooltip } from '@hey/ui';

const Toggle = ({
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
}) => {
  return (
    <Tooltip content={tooltip} placement="top">
      <button
        className="outline-unset focus-visible:outline-unset flex items-center justify-center rounded-md bg-transparent p-2 font-medium transition hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-900 disabled:pointer-events-none disabled:opacity-50 hover:disabled:opacity-50 data-[state=on]:bg-gray-200/60 dark:hover:bg-zinc-800 dark:focus-visible:ring-zinc-300 dark:data-[state=on]:bg-gray-700/60"
        data-state={pressed ? 'on' : 'off'}
        disabled={disabled}
        onClick={() => onClick?.()}
        onMouseDown={(event) => event.preventDefault()}
      >
        {children}
      </button>
    </Tooltip>
  );
};

export default Toggle;
