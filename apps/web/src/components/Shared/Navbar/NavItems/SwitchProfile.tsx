import { SwitchHorizontalIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import type { FC } from 'react';
import React from 'react';
import { useGlobalModalStateStore } from 'src/store/modals';

interface Props {
  className?: string;
}

const SwitchProfile: FC<Props> = ({ className = '' }) => {
  const setShowProfileSwitchModal = useGlobalModalStateStore((state) => state.setShowProfileSwitchModal);

  return (
    <button
      type="button"
      className={clsx(
        'flex w-full px-4 py-1.5 text-sm text-gray-700 focus:outline-none dark:text-gray-200',
        className
      )}
      onClick={() => setShowProfileSwitchModal(true)}
    >
      <div className="flex items-center space-x-2">
        <SwitchHorizontalIcon className="h-4 w-4" />
        <span>
          <Trans>Switch Profile</Trans>
        </span>
      </div>
    </button>
  );
};

export default SwitchProfile;
