import type { FC } from 'react';

import { APP_VERSION } from '@hey/data/constants';
import Link from 'next/link';
import urlcat from 'urlcat';

interface AppVersionProps {
  onClick?: () => void;
}

const AppVersion: FC<AppVersionProps> = ({ onClick }) => {
  return (
    <div className="px-6 py-3 text-xs">
      <Link
        className="font-mono"
        href={urlcat('https://github.com/heyxyz/hey/releases/tag/:version', {
          version: `v${APP_VERSION}`
        })}
        onClick={onClick}
        rel="noreferrer noopener"
        target="_blank"
      >
        v{APP_VERSION}
      </Link>
    </div>
  );
};

export default AppVersion;
