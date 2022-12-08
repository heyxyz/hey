import type { FC } from 'react';

import MetaTags from '../Common/MetaTags';

const Loading: FC = () => {
  return (
    <div className="grid h-screen place-items-center">
      <MetaTags />
      <object className="h-[160px] w-[160px]" type="image/svg+xml" data="/logo-loader.svg" />
    </div>
  );
};

export default Loading;
