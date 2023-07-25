import Loader from '@components/Shared/Loader';
import { useInvitesQuery } from '@lenster/lens';
import { ErrorMessage } from '@lenster/ui';
import { t } from '@lingui/macro';
import type { FC } from 'react';

import Invite from './Invite';
import Invited from './Invited';

const Invites: FC = () => {
  const { data, loading, error, refetch } = useInvitesQuery();

  if (loading) {
    return <Loader message={t`Loading invites`} />;
  }

  if (error) {
    return <ErrorMessage title={t`Failed to load invites`} error={error} />;
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto p-5">
      <Invite invitesLeft={data?.invitesLeft ?? 0} refetch={refetch} />
      <div className="divider my-5" />
      <Invited invited={data?.invited ?? []} />
    </div>
  );
};

export default Invites;
