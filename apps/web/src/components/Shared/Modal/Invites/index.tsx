import type { InvitedResult } from '@good/lens';
import type { FC } from 'react';

import Loader from '@components/Shared/Loader';
import { useInvitedProfilesQuery } from '@good/lens';
import { ErrorMessage } from '@good/ui';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import Invite from './Invite';
import Invited from './Invited';

const Invites: FC = () => {
  const { currentProfile } = useProfileStore();
  const { data, error, loading, refetch } = useInvitedProfilesQuery();

  if (loading) {
    return <Loader className="my-5" message="Loading invites" />;
  }

  if (error) {
    return (
      <ErrorMessage
        className="m-5"
        error={error}
        title="Failed to load invites"
      />
    );
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto p-5">
      <Invite
        invitesLeft={currentProfile?.invitesLeft || 0}
        refetch={refetch}
      />
      <div className="divider my-5" />
      <Invited invitedProfiles={data?.invitedProfiles as InvitedResult[]} />
    </div>
  );
};

export default Invites;
