import { APP_NAME } from '@hey/data/constants';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';

const Hero: FC = () => {
  return (
    <div className="divider py-12" data-testid="home-hero">
      <div className="mx-auto flex w-full max-w-screen-xl items-center px-5 py-8 sm:py-12">
        <img
          src="/logo.png"
          className="mr-5 h-24 w-24 sm:mr-8 sm:h-36 sm:w-36"
        />
        <div className="flex-1 space-y-1 tracking-tight sm:max-w-lg">
          <div className="text-2xl font-extrabold sm:text-5xl">
            <Trans>Welcome to {APP_NAME},</Trans>
          </div>
          <div className="lt-text-gray-500 text-2xl font-extrabold sm:text-5xl">
            <Trans>a social network built on Lens Protocol</Trans>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
