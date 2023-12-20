import type { ExploreProfilesRequest, Profile } from '@hey/lens';
import type { FC } from 'react';

import Loader from '@components/Shared/Loader';
import SearchUser from '@components/Shared/SearchUser';
import UserProfile from '@components/Shared/UserProfile';
import { ArrowPathIcon, UsersIcon } from '@heroicons/react/24/outline';
import {
  ExploreProfilesOrderByType,
  LimitType,
  useExploreProfilesQuery
} from '@hey/lens';
import getProfile from '@hey/lib/getProfile';
import { Card, EmptyState, ErrorMessage, Select } from '@hey/ui';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Virtuoso } from 'react-virtuoso';

const List: FC = () => {
  const { push } = useRouter();
  const [orderBy, setOrderBy] = useState<ExploreProfilesOrderByType>(
    ExploreProfilesOrderByType.LatestCreated
  );
  const [value, setValue] = useState('');

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

  return (
    <Card>
      <div className="flex items-center justify-between space-x-5 p-5">
        <SearchUser
          onChange={(event) => setValue(event.target.value)}
          onProfileSelected={(profile) => push(getProfile(profile).staffLink)}
          placeholder="Search profiles..."
          value={value}
        />
        <Select
          className="w-auto"
          defaultValue={orderBy}
          onChange={(e) =>
            setOrderBy(e.target.value as ExploreProfilesOrderByType)
          }
          options={Object.values(ExploreProfilesOrderByType).map((orderBy) => ({
            label: orderBy,
            value: orderBy
          }))}
        />
        <button onClick={() => refetch()} type="button">
          <ArrowPathIcon className="size-5" />
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
            icon={<UsersIcon className="text-brand-500 size-8" />}
            message={<span>No profiles</span>}
          />
        ) : (
          <Virtuoso
            data={profiles}
            endReached={onEndReached}
            itemContent={(_, profile) => {
              return (
                <motion.div
                  animate={{ opacity: 1 }}
                  className="pb-7"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                >
                  <Link href={getProfile(profile as Profile).staffLink}>
                    <UserProfile
                      isBig
                      linkToProfile={false}
                      profile={profile as Profile}
                      showBio
                      showUserPreview={false}
                      timestamp={profile.createdAt}
                    />
                  </Link>
                </motion.div>
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
