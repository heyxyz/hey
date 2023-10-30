import Loader from '@components/Shared/Loader';
import UserProfile from '@components/Shared/UserProfile';
import { NoSymbolIcon } from '@heroicons/react/24/outline';
import type { Profile, WhoHaveBlockedRequest } from '@hey/lens';
import { LimitType, useWhoHaveBlockedQuery } from '@hey/lens';
import { EmptyState, ErrorMessage } from '@hey/ui';
import type { FC } from 'react';
import { useInView } from 'react-cool-inview';
import { useAppStore } from 'src/store/useAppStore';

const List: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  const request: WhoHaveBlockedRequest = { limit: LimitType.TwentyFive };
  const { data, loading, error, fetchMore } = useWhoHaveBlockedQuery({
    variables: { request },
    skip: !currentProfile?.id
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
    return <ErrorMessage error={error} />;
  }

  if (whoHaveBlocked?.length === 0) {
    return (
      <EmptyState
        message="You are not blocking any profiles!"
        icon={<NoSymbolIcon className="text-brand h-8 w-8" />}
        hideCard
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
