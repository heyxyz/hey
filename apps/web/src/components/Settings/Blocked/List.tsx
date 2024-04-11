import type { Profile, WhoHaveBlockedRequest } from '@hey/lens';
import type { FC } from 'react';

import Loader from '@components/Shared/Loader';
import UserProfile from '@components/Shared/UserProfile';
import { NoSymbolIcon } from '@heroicons/react/24/outline';
import { LimitType, useWhoHaveBlockedQuery } from '@hey/lens';
import { Button, EmptyState, ErrorMessage } from '@hey/ui';
import { Virtuoso } from 'react-virtuoso';
import { useGlobalAlertStateStore } from 'src/store/non-persisted/useGlobalAlertStateStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

const List: FC = () => {
  const { currentProfile } = useProfileStore();
  const { setShowBlockOrUnblockAlert } = useGlobalAlertStateStore();

  const request: WhoHaveBlockedRequest = { limit: LimitType.TwentyFive };
  const { data, error, fetchMore, loading } = useWhoHaveBlockedQuery({
    skip: !currentProfile?.id,
    variables: { request }
  });

  const whoHaveBlocked = data?.whoHaveBlocked?.items;
  const pageInfo = data?.whoHaveBlocked?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (!hasMore) {
      return;
    }

    return await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    });
  };

  if (loading) {
    return <Loader className="py-10" />;
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
        icon={<NoSymbolIcon className="size-8" />}
        message="You are not blocking any profiles!"
      />
    );
  }

  return (
    <div className="space-y-4">
      <Virtuoso
        className="virtual-divider-list-window"
        computeItemKey={(index, profile) => `${profile.id}-${index}`}
        data={whoHaveBlocked}
        endReached={onEndReached}
        itemContent={(_, profile) => {
          return (
            <div className="flex items-center justify-between p-5">
              <UserProfile
                hideFollowButton
                hideUnfollowButton
                profile={profile as Profile}
              />
              <Button
                onClick={() =>
                  setShowBlockOrUnblockAlert(true, profile as Profile)
                }
              >
                Unblock
              </Button>
            </div>
          );
        }}
        useWindowScroll
      />
    </div>
  );
};

export default List;
