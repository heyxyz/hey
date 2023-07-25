import { TicketIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import type { FC } from 'react';

interface InvitesProps {
  className?: string;
}

const Invites: FC<InvitesProps> = ({ className = '' }) => {
  return (
    <button
      className={clsx(
        'flex w-full items-center space-x-1.5 text-sm text-gray-700 dark:text-gray-200',
        className
      )}
    >
      <TicketIcon className="h-4 w-4" />
      <div>
        <Trans>Invites</Trans>
      </div>
    </button>
  );
};

export default Invites;
