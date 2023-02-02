import type { FC } from 'react';

import MetaTags from '../Common/MetaTags';

const Loading: FC = () => {
  return (
    <div className="grid h-screen place-items-center">
      <MetaTags />
      <img className="h-28 w-28" height={112} width={112} src="/logo.svg" alt="Logo" />
    </div>
  );
};

export default Loading;
