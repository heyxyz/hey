import type { FC } from 'react';

import { APP_NAME } from '@good/data/constants';

const Hero: FC = () => {
  return (
    <div className="divider py-12">
      <div className="mx-auto flex w-full max-w-screen-xl items-center px-5 py-8 sm:py-12">
        <img
          alt="Good Logo"
          className="mr-5 size-24 sm:mr-8 sm:size-36"
          src="/logo.png"
        />
        <div className="flex-1 space-y-1 tracking-tight sm:max-w-lg">
          <div className="text-2xl font-extrabold sm:text-5xl">
            Welcome to {APP_NAME},
          </div>
          <div className="ld-text-gray-500 text-1xl font-extrabold sm:text-5xl">
            an open social media for the public good built on Lens Protocol and bcharity.net.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
