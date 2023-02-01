import { Spinner } from '@components/UI/Spinner';
import type { FC } from 'react';

interface Props {
  message?: string;
}

const Loader: FC<Props> = ({ message }) => {
  return (
    <div className="space-y-2 p-5 text-center font-bold">
      <Spinner size="md" className="mx-auto" />
      {message ? <div>{message}</div> : null}
    </div>
  );
};

export default Loader;
