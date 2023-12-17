import type { InvitedResult } from '@hey/lens';
import type { FC } from 'react';

import Loader from '@components/Shared/Loader';
import { useInvitedProfilesQuery } from '@hey/lens';
import { ErrorMessage } from '@hey/ui';
import useProfileStore from 'src/store/persisted/useProfileStore';

import Invite from './Invite';
import Invited from './Invited';

const Invites: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const { data, error, loading, refetch } = useInvitedProfilesQuery();

  if (loading) {
    return <Loader message="Loading invites" />;
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
