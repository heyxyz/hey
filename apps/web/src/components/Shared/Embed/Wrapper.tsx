import stopEventPropagation from '@lenster/lib/stopEventPropagation';
import { Card } from '@lenster/ui';
import clsx from 'clsx';
import type { FC, ReactNode } from 'react';

interface WrapperProps {
  children: ReactNode;
  className?: string;
  dataTestId?: string;
  zeroPadding?: boolean;
}

const Wrapper: FC<WrapperProps> = ({
  children,
  className = '',
  dataTestId = '',
  zeroPadding = false
}) => (
  <Card
    className={clsx('mt-3 cursor-auto', className, { 'p-5': !zeroPadding })}
    dataTestId={dataTestId}
    onClick={stopEventPropagation}
  >
    {children}
  </Card>
);

export default Wrapper;
