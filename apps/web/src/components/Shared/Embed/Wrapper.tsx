import stopEventPropagation from '@lenster/lib/stopEventPropagation';
import { Card } from '@lenster/ui';
import clsx from 'clsx';
import type { FC, ReactNode } from 'react';

interface WrapperProps {
  children: ReactNode;
  dataTestId?: string;
  zeroPadding?: boolean;
}

const Wrapper: FC<WrapperProps> = ({
  children,
  dataTestId = '',
  zeroPadding = false
}) => (
  <Card
    className={clsx('mt-3 cursor-auto', { 'p-5': !zeroPadding })}
    dataTestId={dataTestId}
    onClick={stopEventPropagation}
  >
    {children}
  </Card>
);

export default Wrapper;
