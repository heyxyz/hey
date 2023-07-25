import { TicketIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import type { InvitedResult } from '@lenster/lens';
import formatAddress from '@lenster/lib/formatAddress';
import { EmptyState, Input } from '@lenster/ui';
import { formatDate } from '@lib/formatTime';
import { Plural, Trans } from '@lingui/macro';
import type { FC } from 'react';

interface InvitedProps {
  invited: InvitedResult[];
}

const Invited: FC<InvitedProps> = ({ invited }) => {
  if (invited?.length === 0) {
    return (
      <EmptyState
        message={
          <div>
            <Trans>You haven't invited anyone.</Trans>
          </div>
        }
        icon={<TicketIcon className="text-brand h-8 w-8" />}
        hideCard
      />
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <Trans>
          You have already invited{' '}
          <b>
            {invited.length}
            {invited.length >= 50 ? '+' : null}{' '}
            <Plural
              value={invited.length}
              zero="address"
              one="address"
              other="addresses"
            />
          </b>
          !
        </Trans>
      </div>
      {invited.map((invite, key) => (
        <div key={key}>
          <Input
            className="text-sm"
            iconLeft={<CheckCircleIcon className="text-brand h-5 w-5" />}
            value={`${formatAddress(invite.address)} invited on ${formatDate(
              invite.when
            )}`}
            disabled
          />
        </div>
      ))}
    </div>
  );
};

export default Invited;
