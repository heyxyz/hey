import type { PaginatedRequest, Profile } from '@hey/lens';
import type { FC } from 'react';

import Loader from '@components/Shared/Loader';
import SmallUserProfile from '@components/Shared/SmallUserProfile';
import {
  ArrowPathIcon,
  ArrowRightCircleIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import {
  ExploreProfilesOrderByType,
  LimitType,
  useModFollowersQuery
} from '@hey/lens';
import getProfile from '@hey/lib/getProfile';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import cn from '@hey/ui/cn';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Virtuoso } from 'react-virtuoso';

const Followerings: FC = () => {
  const { pathname, push } = useRouter();
  const [orderBy, setOrderBy] = useState<ExploreProfilesOrderByType>(
    ExploreProfilesOrderByType.LatestCreated
  );
  const [value, setValue] = useState('');
  const [refetching, setRefetching] = useState(false);

  // Variables
  const request: PaginatedRequest = {
    limit: LimitType.Fifty
  };

  const { data, error, fetchMore, loading, refetch } = useModFollowersQuery({
    variables: { request }
  });

  const profiles = data?.modFollowers.items;
  const pageInfo = data?.modFollowers?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (!hasMore) {
      return;
    }

    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    });
  };

  const onRefetch = async () => {
    setRefetching(true);
    await refetch();
    setRefetching(false);
  };

  return (
    <Card>
      <div className="flex items-center justify-between space-x-5 p-5">
        <div className="text-lg font-bold">Followerings</div>
        <button onClick={onRefetch} type="button">
          <ArrowPathIcon
            className={cn(refetching && 'animate-spin', 'size-5')}
          />
        </button>
      </div>
      <div className="divider" />
      <div className="m-5">
        {loading ? (
          <Loader className="my-5" message="Loading followerings..." />
        ) : error ? (
          <ErrorMessage error={error} title="Failed to load followerings" />
        ) : !profiles?.length ? (
          <EmptyState
            hideCard
            icon={<UsersIcon className="size-8" />}
            message={<span>No profiles</span>}
          />
        ) : (
          <Virtuoso
            computeItemKey={(index, profile) =>
              `${profile.following.id}-${profile.follower.id}-${index}`
            }
            data={profiles}
            endReached={onEndReached}
            itemContent={(index, profile) => {
              return (
                <div className={cn(index !== 0 && 'pt-5', 'flex')}>
                  <Link href={getProfile(profile.follower as Profile).link}>
                    <SmallUserProfile
                      hideSlug
                      linkToProfile={false}
                      profile={profile.follower as Profile}
                    />
                  </Link>
                  <ArrowRightCircleIcon className="mx-2 size-5" />
                  <Link href={getProfile(profile.following as Profile).link}>
                    <SmallUserProfile
                      hideSlug
                      linkToProfile={false}
                      profile={profile.following as Profile}
                      timestamp={profile.createdAt}
                    />
                  </Link>
                </div>
              );
            }}
            useWindowScroll
          />
        )}
      </div>
    </Card>
  );
};

export default Followerings;
