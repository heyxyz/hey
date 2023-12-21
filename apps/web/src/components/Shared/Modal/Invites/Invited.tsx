import type { InvitedResult } from '@hey/lens';
import type { FC } from 'react';

import { TicketIcon } from '@heroicons/react/24/outline';
import { EmptyState } from '@hey/ui';
import plur from 'plur';

import Profile from './Profile';

interface InvitedProps {
  invitedProfiles: InvitedResult[];
}

const Invited: FC<InvitedProps> = ({ invitedProfiles }) => {
  if (invitedProfiles?.length === 0) {
    return (
      <EmptyState
        hideCard
        icon={<TicketIcon className="text-brand-500 size-8" />}
        message={<div>You haven't invited anyone.</div>}
      />
    );
  }

  const sortedInvited = [...invitedProfiles].sort(
    (a, b) => Date.parse(b.when) - Date.parse(a.when)
  );

  return (
    <div className="space-y-3">
      <div>
        You have already invited{' '}
        <b>
          {invitedProfiles.length}
          {invitedProfiles.length >= 50 ? '+' : null}{' '}
          {plur('address', invitedProfiles.length)}
        </b>
        !
      </div>
      {sortedInvited.map((invite) => (
        <div key={invite.addressInvited}>
          <Profile invite={invite} />
        </div>
      ))}
    </div>
  );
};

export default Invited;
