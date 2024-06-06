import type { FC, ReactNode } from 'react';

import stopEventPropagation from '@good/helpers/stopEventPropagation';
import { Card } from '@good/ui';
import cn from '@good/ui/cn';

interface WrapperProps {
  children: ReactNode;
  className?: string;
  zeroPadding?: boolean;
}

const Wrapper: FC<WrapperProps> = ({
  children,
  className = '',
  zeroPadding = false
}) => (
  <Card
    className={cn('mt-3 cursor-auto', className, { 'p-5': !zeroPadding })}
    forceRounded
    onClick={stopEventPropagation}
  >
    {children}
  </Card>
);

export default Wrapper;
