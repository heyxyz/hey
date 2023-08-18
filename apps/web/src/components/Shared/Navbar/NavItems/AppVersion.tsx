import { APP_VERSION } from '@lenster/data/constants';
import Link from 'next/link';
import type { FC } from 'react';

interface AppVersionProps {
  onClick?: () => void;
}

const AppVersion: FC<AppVersionProps> = ({ onClick }) => {
  return (
    <div className="px-6 py-3 text-xs">
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
