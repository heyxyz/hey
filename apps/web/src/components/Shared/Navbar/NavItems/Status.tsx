import { EmojiHappyIcon } from '@heroicons/react/outline';
import getAttribute from '@lib/getAttribute';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import type { FC } from 'react';
import React from 'react';
import { useAppStore } from 'src/store/app';
import { useGlobalModalStateStore } from 'src/store/modals';

type Props = {
  className?: string;
};

const Status: FC<Props> = ({ className = '' }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setShowStatusModal = useGlobalModalStateStore((state) => state.setShowStatusModal);

  const statusEmoji = getAttribute(currentProfile?.attributes, 'statusEmoji');
  const statusMessage = getAttribute(currentProfile?.attributes, 'statusMessage');
  const hasStatus = statusEmoji && statusMessage;

  return (
    <button
      type="button"
      className={clsx(
        'flex text-sm px-4 items-center space-x-2 py-1.5 w-full text-gray-700 dark:text-gray-200',
        className
      )}
      onClick={() => setShowStatusModal(true)}
    >
      {hasStatus ? (
        <>
          <span>{statusEmoji}</span>
          <span className="truncate">{statusMessage}</span>
        </>
      ) : (
        <>
          <EmojiHappyIcon className="w-4 h-4" />
          <span>
            <Trans>Set status</Trans>
          </span>
        </>
      )}
    </button>
  );
};

export default Status;
