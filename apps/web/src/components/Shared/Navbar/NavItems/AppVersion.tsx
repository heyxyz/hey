import { APP_VERSION } from 'data/constants';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';

interface Props {
  onClick?: () => void;
}

const AppVersion: FC<Props> = ({ onClick }) => {
  return (
    <div className="py-3 px-6 text-xs">
      <Link
        href={`https://github.com/lensterxyz/lenster/releases/tag/v${APP_VERSION}`}
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
