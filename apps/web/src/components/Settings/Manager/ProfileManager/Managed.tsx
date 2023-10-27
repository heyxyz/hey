import Loader from '@components/Shared/Loader';
import UserProfile from '@components/Shared/UserProfile';
import { UsersIcon } from '@heroicons/react/24/outline';
import type { Profile } from '@hey/lens';
import { useProfilesManagedQuery } from '@hey/lens';
import { EmptyState, ErrorMessage } from '@hey/ui';
import type { FC } from 'react';
import { useAccount } from 'wagmi';

const Managed: FC = () => {
  const { address } = useAccount();

  const { data, loading, error } = useProfilesManagedQuery({
    variables: { request: { for: address } }
  });

  const profilesManaged = data?.profilesManaged.items || [];

  return (
    <div className="space-y-3 pt-2">
      <div>
        <div>Profiles under your oversight and management.</div>
        <div className="divider my-5" />
        <div className="space-y-5">
          {loading ? (
            <Loader />
          ) : error ? (
            <ErrorMessage className="m-5" error={error} />
          ) : profilesManaged.length < 1 ? (
            <EmptyState
              message="You are not managing any profiles!"
              icon={<UsersIcon className="text-brand h-8 w-8" />}
              hideCard
            />
          ) : (
            profilesManaged.map((profile) => (
              <div key={profile.id}>
                <UserProfile profile={profile as Profile} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Managed;
