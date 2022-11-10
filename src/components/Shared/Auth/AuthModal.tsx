import type { FC } from 'react';
import { IS_MAINNET, STATIC_ASSETS } from 'src/constants';

import NewProfile from './New';

const AuthModal: FC = () => {
  return (
    <div className="p-5">
      {IS_MAINNET ? (
        <div>
          <div className="mb-2 space-y-4">
            <img
              className="w-16 h-16 rounded-full"
              height={64}
              width={64}
              src={`${STATIC_ASSETS}/brands/lens.png`}
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
              <div className="text-sm text-gray-500">Make sure to check back here when done!</div>
            </div>
          </div>
        </div>
      ) : (
        <NewProfile isModal />
      )}
    </div>
  );
};

export default AuthModal;
