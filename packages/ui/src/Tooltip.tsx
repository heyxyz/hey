import 'tippy.js/dist/tippy.css';

import Tippy from '@tippyjs/react';
import type { FC, ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  placement?: 'top' | 'right';
  className?: string;
  withDelay?: boolean;
}

export const Tooltip: FC<TooltipProps> = ({
  children,
  content,
  placement = 'right',
  className = '',
  withDelay = false
}) => {
  return (
    <Tippy
      placement={placement}
      duration={0}
      delay={[withDelay ? 500 : 0, 0]}
      className="hidden !rounded-lg !text-xs !leading-6 tracking-wide sm:block"
      content={<span className={className}>{content}</span>}
    >
      <span>{children}</span>
    </Tippy>
  );
};
