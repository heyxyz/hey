import { Trans } from '@lingui/macro';
import { APP_NAME } from 'data/constants';
import type { FC } from 'react';

const Hero: FC = () => {
  return (
    <div className="py-12 border-b bg-hero dark:border-b-gray-700">
      <div className="px-5 mx-auto max-w-screen-xl flex items-stretch py-8 w-full text-center sm:py-12 sm:text-left">
        <div className="flex-1 space-y-3">
          <div className="text-2xl font-extrabold sm:text-4xl font-serif">
            <Trans>Welcome to {APP_NAME} 👋</Trans>
          </div>
          <div className="leading-7 text-gray-700 dark:text-gray-300">
            <Trans>
              {APP_NAME} is a decentralized, and permissionless social media app built with Lens Protocol 🌿
            </Trans>
          </div>
        </div>
        <div className="hidden flex-1 flex-shrink-0 w-full sm:block" />
      </div>
    </div>
  );
};

export default Hero;
