import { APP_VERSION } from '@hey/data/constants';
import { type FC } from 'react';
import { Link } from 'react-router-dom';
// @ts-ignore
import urlcat from 'urlcat';

interface AppVersionProps {
  onClick?: () => void;
}

const AppVersion: FC<AppVersionProps> = ({ onClick }) => {
  return (
    <div className="px-6 py-3 text-xs">
      <Link
        to={urlcat('https://github.com/heyxyz/hey/releases/tag/:version', {
          version: `v${APP_VERSION}`
        })}
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
