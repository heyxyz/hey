import Loader from '@components/Shared/Loader';
import UserProfile from '@components/Shared/UserProfile';
import type { Profile } from '@hey/lens';
import { useProfilesManagedQuery } from '@hey/lens';
import { ErrorMessage } from '@hey/ui';
import { type FC } from 'react';
import { useAccount } from 'wagmi';

const Managed: FC = () => {
  const { address } = useAccount();

  const { data, loading, error } = useProfilesManagedQuery({
    variables: { request: { for: address } }
  });

  return (
    <div className="space-y-3 pt-2">
      {loading ? (
        <div className="py-5">
          <Loader />
        </div>
      ) : error ? (
        <ErrorMessage className="m-5" error={error} />
      ) : (
        <div>
          <div>Profiles under your oversight and management.</div>
          <div className="divider my-5" />
          <div className="space-y-5">
            {data?.profilesManaged.items.map((profile) => (
              <div key={profile.id}>
                <UserProfile profile={profile as Profile} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Managed;
