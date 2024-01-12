import type {
  LastLoggedInProfileRequest,
  Profile,
  ProfileManagersRequest
} from '@hey/lens';
import type { FC } from 'react';

import Loader from '@components/Shared/Loader';
import UserProfile from '@components/Shared/UserProfile';
import { UsersIcon } from '@heroicons/react/24/outline';
import { useProfilesManagedQuery } from '@hey/lens';
import { EmptyState, ErrorMessage } from '@hey/ui';
import { useInView } from 'react-cool-inview';
import { useAccount } from 'wagmi';

const List: FC = () => {
  const { address } = useAccount();

  const request: LastLoggedInProfileRequest | ProfileManagersRequest = {
    for: address
  };
  const { data, error, fetchMore, loading } = useProfilesManagedQuery({
    variables: {
      lastLoggedInProfileRequest: request,
      profilesManagedRequest: request
    }
  });

  const profilesManaged = data?.profilesManaged.items;
  const pageInfo = data?.profilesManaged?.pageInfo;
  const hasMore = pageInfo?.next;

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView || !hasMore) {
        return;
      }

      return await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  });

  if (loading) {
    return (
      <div className="pb-5">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage error={error} title="Failed to load managed profiles" />
    );
  }

  if (profilesManaged?.length === 0) {
    return (
      <EmptyState
        hideCard
        icon={<UsersIcon className="text-brand-500 size-8" />}
        message="You are not managing any profiles!"
      />
    );
  }

  return (
    <div className="space-y-4">
      {profilesManaged?.map((profile) => (
        <div key={profile.id}>
          <UserProfile profile={profile as Profile} />
        </div>
      ))}
      {hasMore ? <span ref={observe} /> : null}
    </div>
  );
};

export default List;
