import type { Profile, WhoHaveBlockedRequest } from '@hey/lens';
import type { FC } from 'react';

import Loader from '@components/Shared/Loader';
import UserProfile from '@components/Shared/UserProfile';
import { NoSymbolIcon } from '@heroicons/react/24/outline';
import { LimitType, useWhoHaveBlockedQuery } from '@hey/lens';
import { EmptyState, ErrorMessage } from '@hey/ui';
import { useInView } from 'react-cool-inview';
import useProfileStore from 'src/store/persisted/useProfileStore';

const List: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);

  const request: WhoHaveBlockedRequest = { limit: LimitType.TwentyFive };
  const { data, error, fetchMore, loading } = useWhoHaveBlockedQuery({
    skip: !currentProfile?.id,
    variables: { request }
  });

  const whoHaveBlocked = data?.whoHaveBlocked?.items;
  const pageInfo = data?.whoHaveBlocked?.pageInfo;
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
      <ErrorMessage error={error} title="Failed to load blocked profiles" />
    );
  }

  if (whoHaveBlocked?.length === 0) {
    return (
      <EmptyState
        hideCard
        icon={<NoSymbolIcon className="text-brand-500 size-8" />}
        message="You are not blocking any profiles!"
      />
    );
  }

  return (
    <div className="space-y-4">
      {whoHaveBlocked?.map((profile) => (
        <div key={profile.id}>
          <UserProfile profile={profile as Profile} />
        </div>
      ))}
      {hasMore ? <span ref={observe} /> : null}
    </div>
  );
};

export default List;
