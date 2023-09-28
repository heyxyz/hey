import MetaTags from '@components/Common/MetaTags';
import LoginButton from '@components/Shared/Navbar/LoginButton';
import { APP_NAME } from '@hey/data/constants';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';

const NotLoggedIn: FC = () => {
  return (
    <div className="page-center flex-col">
      <MetaTags title={`Not logged in • ${APP_NAME}`} />
      <img
        className="h-20 w-20"
        height={80}
        width={80}
        src={'/logo.png'}
        alt="Logo"
      />
      <div className="py-10 text-center">
        <h1 className="mb-4 text-3xl font-bold">
          <Trans>Not logged in!</Trans>
        </h1>
        <div className="mb-4">
          <Trans>Log in to continue</Trans>
        </div>
        <LoginButton isBig />
      </div>
    </div>
  );
};

export default NotLoggedIn;
