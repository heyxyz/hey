import isPrimeMonth from '@lenster/lib/isPrideMonth';
import type { FC } from 'react';

import MetaTags from '../Common/MetaTags';

const Loading: FC = () => {
  return (
    <div className="grid h-screen place-items-center">
      <MetaTags />
      <img
        className="h-28 w-28"
        height={112}
        width={112}
        src={isPrimeMonth() ? '/pride.svg' : '/logo.svg'}
        alt="Logo"
      />
    </div>
  );
};

export default Loading;
