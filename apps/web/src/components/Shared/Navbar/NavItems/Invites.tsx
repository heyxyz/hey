import type { FC } from 'react';

import { TicketIcon } from '@heroicons/react/24/outline';
import { INVITE } from '@hey/data/tracking';
import cn from '@hey/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';

interface InvitesProps {
  className?: string;
}

const Invites: FC<InvitesProps> = ({ className = '' }) => {
  const setShowInvitesModal = useGlobalModalStateStore(
    (state) => state.setShowInvitesModal
  );

  return (
    <button
      className={cn(
        'flex w-full items-center space-x-1.5 px-2 py-1.5 text-left text-sm text-gray-700 dark:text-gray-200',
        className
      )}
      onClick={() => {
        setShowInvitesModal(true);
        Leafwatch.track(INVITE.OPEN_INVITE);
      }}
      type="button"
    >
      <TicketIcon className="size-4" />
      <div>Invites</div>
    </button>
  );
};

export default Invites;
