import type { FC } from 'react';

import isPrideMonth from '@hey/lib/isPrideMonth';

import MetaTags from '../Common/MetaTags';

const Loading: FC = () => {
  return (
    <div className="grid h-screen place-items-center">
      <MetaTags />
      <img
        alt="Logo"
        className="size-28"
        height={112}
        src={isPrideMonth() ? '/pride.png' : '/logo.png'}
        width={112}
      />
    </div>
  );
};

export default Loading;
