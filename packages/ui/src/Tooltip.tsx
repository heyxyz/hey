import type { FC, ReactNode } from 'react';

import * as RadixTooltip from '@radix-ui/react-tooltip';

interface TooltipProps {
  children: ReactNode;
  className?: string;
  content: ReactNode;
  placement?: 'bottom' | 'left' | 'right' | 'top';
  withDelay?: boolean;
}

export const Tooltip: FC<TooltipProps> = ({
  children,
  className = '',
  content,
  placement = 'right',
  withDelay = false
}) => {
  return (
    <RadixTooltip.Provider delayDuration={withDelay ? 400 : 0}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>
          <span className={className}>{children}</span>
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            className="z-10 hidden !rounded-lg bg-gray-700 px-3 py-0.5 !text-xs !leading-6 tracking-wide text-white sm:block"
            side={placement}
            sideOffset={5}
          >
            <span>{content}</span>
            <RadixTooltip.Arrow className="fill-gray-700" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
};
