import React, { FC } from 'react';
import { STATIC_ASSETS } from 'src/constants';

interface Props {
  appConfig: {
    id: string;
    name: string;
    logo: string;
  } | null;
}

const ViaApp: FC<Props> = ({ appConfig }) => {
  if (!appConfig) return null;

  return (
    <div className="flex items-center py-3 px-5 space-x-2 text-gray-500 border-t dark:border-t-gray-700/80">
      <img
        src={`${STATIC_ASSETS}/apps/${appConfig.logo}`}
        className="w-5 h-5"
        height={20}
        width={20}
        alt={appConfig.name}
      />
      <div>Posted via {appConfig.name}</div>
    </div>
  );
};

export default ViaApp;
