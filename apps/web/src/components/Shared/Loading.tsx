import type { FC } from 'react';

import isPrideMonth from '@hey/lib/isPrideMonth';

import PageMetatags from './PageMetatags';

const Loading: FC = () => {
  return (
    <div className="grid h-screen place-items-center">
      <PageMetatags />
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
