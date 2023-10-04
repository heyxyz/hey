import { TicketIcon } from '@heroicons/react/24/outline';
import type { InvitedResult } from '@hey/lens';
import { EmptyState } from '@hey/ui';
import { Plural, Trans } from '@lingui/macro';
import type { FC } from 'react';

import Profile from './Profile';

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

  const sortedInvited = [...invited].sort(
    (a, b) => Date.parse(b.when) - Date.parse(a.when)
  );

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
      {sortedInvited.map((invite, key) => (
        <div key={key}>
          <Profile invite={invite} />
        </div>
      ))}
    </div>
  );
};

export default Invited;
