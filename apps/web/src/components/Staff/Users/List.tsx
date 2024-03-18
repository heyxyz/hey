import type { ExploreProfilesRequest, Profile } from '@hey/lens';
import type { FC } from 'react';

import Loader from '@components/Shared/Loader';
import P2PRecommendation from '@components/Shared/Profile/P2PRecommendation';
import SearchProfiles from '@components/Shared/SearchProfiles';
import UserProfile from '@components/Shared/UserProfile';
import { ArrowPathIcon, UsersIcon } from '@heroicons/react/24/outline';
import {
  ExploreProfilesOrderByType,
  LimitType,
  useExploreProfilesQuery
} from '@hey/lens';
import getProfile from '@hey/lib/getProfile';
import { Card, EmptyState, ErrorMessage, Select } from '@hey/ui';
import cn from '@hey/ui/cn';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Virtuoso } from 'react-virtuoso';

const List: FC = () => {
  const { pathname, push } = useRouter();
  const [orderBy, setOrderBy] = useState<ExploreProfilesOrderByType>(
    ExploreProfilesOrderByType.LatestCreated
  );
  const [value, setValue] = useState('');
  const [refetching, setRefetching] = useState(false);

  // Variables
  const request: ExploreProfilesRequest = {
    limit: LimitType.Fifty,
    orderBy
  };

  const { data, error, fetchMore, loading, refetch } = useExploreProfilesQuery({
    variables: { request }
  });

  const profiles = data?.exploreProfiles.items;
  const pageInfo = data?.exploreProfiles?.pageInfo;
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
        <SearchProfiles
          onChange={(event) => setValue(event.target.value)}
          onProfileSelected={(profile) => {
            if (pathname === '/mod') {
              push(getProfile(profile).link);
            } else {
              push(getProfile(profile).staffLink);
            }
          }}
          placeholder="Search profiles..."
          skipGardeners
          value={value}
        />
        <Select
          className="w-72"
          defaultValue={orderBy}
          onChange={(value) => setOrderBy(value as ExploreProfilesOrderByType)}
          options={Object.values(ExploreProfilesOrderByType).map((type) => ({
            label: type,
            selected: orderBy === type,
            value: type
          }))}
        />
        <button onClick={onRefetch} type="button">
          <ArrowPathIcon
            className={cn(refetching && 'animate-spin', 'size-5')}
          />
        </button>
      </div>
      <div className="divider" />
      <div className="p-5">
        {loading ? (
          <Loader message="Loading profiles..." />
        ) : error ? (
          <ErrorMessage error={error} title="Failed to load profiles" />
        ) : !profiles?.length ? (
          <EmptyState
            hideCard
            icon={<UsersIcon className="size-8" />}
            message={<span>No profiles</span>}
          />
        ) : (
          <Virtuoso
            computeItemKey={(_, profile) => profile.id}
            data={profiles}
            endReached={onEndReached}
            itemContent={(_, profile) => {
              return (
                <div className="flex flex-wrap items-center justify-between gap-y-5 pb-7">
                  <Link
                    href={
                      pathname === '/mod'
                        ? getProfile(profile as Profile).link
                        : getProfile(profile as Profile).staffLink
                    }
                  >
                    <UserProfile
                      isBig
                      linkToProfile={false}
                      profile={profile as Profile}
                      showBio={false}
                      showId
                      showUserPreview={false}
                      timestamp={profile.createdAt}
                    />
                  </Link>
                  <P2PRecommendation profile={profile as Profile} />
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

export default List;
