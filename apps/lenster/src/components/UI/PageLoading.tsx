import React, { FC } from 'react';

import { Spinner } from './Spinner';

interface Props {
  message?: string;
}

export const PageLoading: FC<Props> = ({ message }) => {
  return (
    <div className="flex flex-grow justify-center items-center">
      <div className="space-y-3">
        <Spinner className="mx-auto" />
        <div>{message}</div>
      </div>
    </div>
  );
};
