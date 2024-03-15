import type { FC } from 'react';

import { FlagIcon } from '@heroicons/react/24/outline';
import { APP_NAME } from '@hey/data/constants';
import { GridItemEight, GridLayout } from '@hey/ui';
import showCrisp from '@lib/showCrisp';
import { useProfileRestriction } from 'src/store/non-persisted/useProfileRestriction';

const Flagged: FC = () => {
  const { isFlagged, isSuspended } = useProfileRestriction();

  if (!isFlagged || isSuspended) {
    return null;
  }

  return (
    <div className="border-b border-gray-300 bg-gray-500/20">
      <GridLayout>
        <GridItemEight className="space-y-1">
          <div className="flex items-center space-x-2 text-gray-700">
            <FlagIcon className="size-5" />
            <div className="text-base font-bold sm:text-lg">
              Your profile has been flagged by {APP_NAME}.
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Because of that, your profile may limit your ability to interact
            with {APP_NAME} and other users.{' '}
            <button className="underline" onClick={showCrisp}>
              Contact us
            </button>{' '}
            if you think this is a mistake.
          </div>
        </GridItemEight>
      </GridLayout>
    </div>
  );
};

export default Flagged;
