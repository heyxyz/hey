'use client';
import type { FC } from 'react';
import { Spinner } from 'ui';

interface LoaderProps {
  message?: string;
}

const Loader: FC<LoaderProps> = ({ message }) => {
  return (
    <div className="space-y-2 p-5 text-center font-bold">
      <Spinner size="md" className="mx-auto" />
      {message ? <div>{message}</div> : null}
    </div>
  );
};

export default Loader;
