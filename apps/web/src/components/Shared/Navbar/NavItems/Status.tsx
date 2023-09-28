import { FaceSmileIcon } from '@heroicons/react/24/outline';
import getProfileAttribute from '@hey/lib/getProfileAttribute';
import cn from '@hey/ui/cn';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';
import { useGlobalModalStateStore } from 'src/store/modals';

interface StatusProps {
  className?: string;
}

const Status: FC<StatusProps> = ({ className = '' }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setShowStatusModal = useGlobalModalStateStore(
    (state) => state.setShowStatusModal
  );

  const statusEmoji = getProfileAttribute(
    currentProfile?.attributes,
    'statusEmoji'
  );
  const statusMessage = getProfileAttribute(
    currentProfile?.attributes,
    'statusMessage'
  );
  const hasStatus = statusEmoji && statusMessage;

  return (
    <button
      type="button"
      className={cn(
        'flex w-full items-center space-x-2 px-2 py-1.5 text-left text-sm text-gray-700 dark:text-gray-200',
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
          <div>
            <FaceSmileIcon className="h-4 w-4" />
          </div>
          <span>
            <Trans>Set status</Trans>
          </span>
        </>
      )}
    </button>
  );
};

export default Status;
