import Tippy from '@tippyjs/react';
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
  placement?: 'right' | 'top';
  theme?: string;
  withDelay?: boolean;
}

export const Tooltip: FC<TooltipProps> = ({
  arrow,
  asPopover,
  children,
  className = '',
  content,
  interactive,
  placement = 'right',
  theme,
  withDelay = false
}) => {
  return (
    <Tippy
      arrow={arrow}
      className="hidden !rounded-lg !text-xs !leading-6 tracking-wide sm:block"
      content={<span className={className}>{content}</span>}
      delay={[withDelay ? 500 : 0, 0]}
      duration={0}
      interactive={interactive}
      placement={placement}
      theme={theme}
      {...(asPopover && { trigger: 'click' })}
    >
      <span>{children}</span>
    </Tippy>
  );
};
