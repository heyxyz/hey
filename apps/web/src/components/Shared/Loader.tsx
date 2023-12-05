import type { FC } from 'react';

import { Spinner } from '@hey/ui';

interface LoaderProps {
  message?: string;
}

const Loader: FC<LoaderProps> = ({ message }) => {
  return (
    <div className="space-y-2 p-5 text-center font-bold">
      <Spinner className="mx-auto" size="md" />
      {message ? <div>{message}</div> : null}
    </div>
  );
};

export default Loader;
