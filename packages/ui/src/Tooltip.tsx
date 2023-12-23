import * as RadixTooltip from '@radix-ui/react-tooltip';
import { type FC, type ReactNode } from 'react';
import 'tippy.js/dist/tippy.css';

interface TooltipProps {
  arrow?: boolean;
  asPopover?: boolean;
  children: ReactNode;
  className?: string;
  content: ReactNode;
  /**
   * Make the popup content interactive i.e clickable or selectable
   */
  interactive?: boolean;
  placement?: 'bottom' | 'left' | 'right' | 'top';
  theme?: string;
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
          <span>{children}</span>
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            className="z-10 hidden !rounded-lg bg-gray-700 px-3 py-0.5 !text-xs !leading-6 tracking-wide text-white sm:block"
            side={placement}
            sideOffset={5}
          >
            <span className={className}>{content}</span>
            <RadixTooltip.Arrow className="fill-gray-700" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
};
