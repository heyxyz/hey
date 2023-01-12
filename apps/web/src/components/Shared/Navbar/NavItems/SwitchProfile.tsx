import { SwitchHorizontalIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import type { FC } from 'react';
import React from 'react';
import { useGlobalModalStateStore } from 'src/store/modals';

type Props = {
  className?: string;
};

const SwitchProfile: FC<Props> = ({ className = '' }) => {
  const setShowProfileSwitchModal = useGlobalModalStateStore((state) => state.setShowProfileSwitchModal);

  return (
    <button
      type="button"
      className={clsx(
        'flex px-4 py-1.5 focus:outline-none text-sm w-full text-gray-700 dark:text-gray-200',
        className
      )}
      onClick={() => setShowProfileSwitchModal(true)}
    >
      <div className="flex items-center space-x-2">
        <SwitchHorizontalIcon className="w-4 h-4" />
        <span>
          <Trans>Switch Profile</Trans>
        </span>
      </div>
    </button>
  );
};

export default SwitchProfile;
