import type { FC } from 'react';

import { Spinner } from '@hey/ui';
import cn from '@hey/ui/cn';

interface LoaderProps {
  className?: string;
  message?: string;
}

const Loader: FC<LoaderProps> = ({ className = '', message }) => {
  return (
    <div className={cn('space-y-2 p-5 text-center font-bold', className)}>
      <Spinner className="mx-auto" size="md" />
      {message ? <div>{message}</div> : null}
    </div>
  );
};

export default Loader;
