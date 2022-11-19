import { Spinner } from '@components/UI/Spinner';
import type { FC } from 'react';

interface Props {
  message: string;
}

const Loader: FC<Props> = ({ message }) => {
  return (
    <div className="p-5 space-y-2 font-bold text-center">
      <Spinner size="md" className="mx-auto" />
      <div>{message}</div>
    </div>
  );
};

export default Loader;
