import type { FC } from 'react';

import { Spinner } from '@hey/ui';
import cn from '@hey/ui/cn';

interface LoaderProps {
  className?: string;
  message?: string;
  smallSpinner?: boolean;
}

const Loader: FC<LoaderProps> = ({
  className = '',
  message,
  smallSpinner = false
}) => {
  return (
    <div className={cn('space-y-2 p-5 text-center font-bold', className)}>
      <Spinner className="mx-auto" size={smallSpinner ? 'sm' : 'md'} />
      {message ? <div>{message}</div> : null}
    </div>
  );
};

export default Loader;
