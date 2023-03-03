import 'tippy.js/dist/tippy.css';

import Tippy from '@tippyjs/react';
import clsx from 'clsx';
import type { FC, ReactNode } from 'react';
interface Props {
  children: ReactNode;
  content: ReactNode;
  placement?: 'top' | 'right' | 'bottom';
  className?: string;
  disabled?: boolean;
  withDelay?: boolean;
}

export const Tooltip: FC<Props> = ({
  children,
  content,
  placement = 'right',
  className = '',
  disabled = false,
  withDelay = false
}) => {
  return (
    <Tippy
      disabled={disabled}
      placement={placement}
      duration={0}
      delay={[withDelay ? 500 : 0, 0]}
      className="hidden !rounded-lg !text-xs !leading-6 tracking-wide sm:block"
      content={<span className={clsx(className)}>{content}</span>}
    >
      <span>{children}</span>
    </Tippy>
  );
};
