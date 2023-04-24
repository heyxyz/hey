import { APP_VERSION } from 'data/constants';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';

interface AppVersionProps {
  onClick?: () => void;
}

const AppVersion: FC<AppVersionProps> = ({ onClick }) => {
  return (
    <div className="hover:text-brand-500 hover:bg-darker px-4 py-2 text-xs">
      <Link
        href={`https://github.com/ConsenSys/lineaster/releases/tag/v${APP_VERSION}`}
        className="font-mono"
        target="_blank"
        rel="noreferrer noopener"
        onClick={onClick}
      >
        v{APP_VERSION}
      </Link>
    </div>
  );
};

export default AppVersion;
