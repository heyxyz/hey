import { FC } from 'react';

import Seo from './utils/Seo';

const Loading: FC = () => {
  return (
    <div className="grid h-screen place-items-center">
      <Seo />
      <img className="w-28 h-28" height={112} width={112} src="/logo.svg" alt="Logo" />
    </div>
  );
};

export default Loading;
