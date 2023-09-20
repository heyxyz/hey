import { TicketIcon } from '@heroicons/react/24/outline';
import type { InvitedResult } from '@lenster/lens';
import { EmptyState } from '@lenster/ui';
import { Plural, Trans } from '@lingui/macro';
import type { FC } from 'react';

import Profile from './Profile';

interface InvitedProps {
  invitedProfiles: InvitedResult[];
}

const Invited: FC<InvitedProps> = ({ invitedProfiles }) => {
  if (invitedProfiles?.length === 0) {
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

  const sortedInvited = [...invitedProfiles].sort(
    (a, b) => Date.parse(b.when) - Date.parse(a.when)
  );

  return (
    <div className="space-y-3">
      <div>
        <Trans>
          You have already invited{' '}
          <b>
            {invitedProfiles.length}
            {invitedProfiles.length >= 50 ? '+' : null}{' '}
            <Plural
              value={invitedProfiles.length}
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
