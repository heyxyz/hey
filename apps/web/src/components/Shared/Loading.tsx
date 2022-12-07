import type { FC } from 'react';

import MetaTags from '../Common/MetaTags';

const Loading: FC = () => {
  return (
    <div className="grid h-screen place-items-center">
      <MetaTags />
      <object className="h-36 w-36" height={122} width={122} type="image/svg+xml" data="/logo-loader.svg" />
    </div>
  );
};

export default Loading;
