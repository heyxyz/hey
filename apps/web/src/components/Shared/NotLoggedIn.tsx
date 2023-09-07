import MetaTags from '@components/Common/MetaTags';
import LoginButton from '@components/Shared/Navbar/LoginButton';
import { APP_NAME } from '@lenster/data/constants';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';

const NotLoggedIn: FC = () => {
  return (
    <div className="page-center flex-col">
      <MetaTags title={`Not logged in • ${APP_NAME}`} />
      <img
        className="h-8 w-8"
        height={32}
        width={32}
        src={'/logo.svg'}
        alt="Logo"
      />
      <div className="py-10 text-center">
        <h1 className="mb-4 text-3xl font-bold">
          <Trans>Not logged in</Trans>
        </h1>
        <div className="mb-4">
          <Trans>Log in to continue</Trans>
        </div>
        <LoginButton />
      </div>
    </div>
  );
};

export default NotLoggedIn;
