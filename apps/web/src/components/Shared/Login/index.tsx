import { IS_MAINNET, STATIC_IMAGES_URL } from 'data/constants';
import type { FC } from 'react';

import NewProfile from './New';

const Login: FC = () => {
  return (
    <div className="p-5">
      {IS_MAINNET ? (
        <div className="mb-2 space-y-4">
          <img
            className="h-16 w-16 rounded-full"
            height={64}
            width={64}
            src={`${STATIC_IMAGES_URL}/brands/lens.png`}
            alt="Logo"
          />
          <div className="text-xl font-bold">Claim your Lens profile 🌿</div>
          <div className="space-y-1">
            <div className="linkify">
              Visit{' '}
              <a
                className="font-bold"
                href="https://claim.lens.xyz"
                target="_blank"
                rel="noreferrer noopener"
              >
                claiming site
              </a>{' '}
              to claim your profile now 🏃‍♂️
            </div>
            <div className="lt-text-gray-500 text-sm">Make sure to check back here when done!</div>
          </div>
        </div>
      ) : (
        <NewProfile isModal />
      )}
    </div>
  );
};

export default Login;
