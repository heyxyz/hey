import type { FC } from 'react';

import MetaTags from '@components/Common/MetaTags';
import LoginButton from '@components/Shared/LoginButton';
import { APP_NAME } from '@hey/data/constants';
import { H2 } from '@hey/ui';

const NotLoggedIn: FC = () => {
  return (
    <div className="page-center flex-col">
      <MetaTags title={`Not logged in • ${APP_NAME}`} />
      <img
        alt="Logo"
        className="size-20"
        height={80}
        src="/logo.png"
        width={80}
      />
      <div className="py-10 text-center">
        <H2 className="mb-4">Not logged in!</H2>
        <div className="mb-4">Log in to continue</div>
        <LoginButton isBig />
      </div>
    </div>
  );
};

export default NotLoggedIn;
