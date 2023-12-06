import type { FC } from 'react';

import MetaTags from '@components/Common/MetaTags';
import LoginButton from '@components/Shared/Navbar/LoginButton';
import { APP_NAME } from '@hey/data/constants';

const NotLoggedIn: FC = () => {
  return (
    <div className="page-center flex-col">
      <MetaTags title={`Not logged in • ${APP_NAME}`} />
      <img
        alt="Logo"
        className="h-20 w-20"
        height={80}
        src="/logo.webp"
        width={80}
      />
      <div className="py-10 text-center">
        <h1 className="mb-4 text-3xl font-bold">Not logged in!</h1>
        <div className="mb-4">Log in to continue</div>
        <LoginButton isBig />
      </div>
    </div>
  );
};

export default NotLoggedIn;
