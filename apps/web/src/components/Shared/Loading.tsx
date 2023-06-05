import type { FC } from 'react';

import MetaTags from '../Common/MetaTags';

const Loading: FC = () => {
  return (
    <div className="grid h-screen place-items-center">
      <MetaTags />
      <span className="relative flex h-24 w-24">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75" />
        <span className="relative inline-flex rounded-full h-24 w-24 bg-brand-500" />
      </span>
    </div>
  );
};

export default Loading;
