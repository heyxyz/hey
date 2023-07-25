import { TicketIcon } from '@heroicons/react/outline';
import { INVITE } from '@lenster/data/tracking';
import { Leafwatch } from '@lib/leafwatch';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import type { FC } from 'react';
import { useGlobalModalStateStore } from 'src/store/modals';

interface InvitesProps {
  className?: string;
}

const Invites: FC<InvitesProps> = ({ className = '' }) => {
  const setShowInvitesModal = useGlobalModalStateStore(
    (state) => state.setShowInvitesModal
  );

  return (
    <button
      className={clsx(
        'flex w-full items-center space-x-1.5 text-sm text-gray-700 dark:text-gray-200',
        className
      )}
      onClick={() => {
        setShowInvitesModal(true);
        Leafwatch.track(INVITE.OPEN_INVITE);
      }}
    >
      <TicketIcon className="h-4 w-4" />
      <div>
        <Trans>Invites</Trans>
      </div>
    </button>
  );
};

export default Invites;
