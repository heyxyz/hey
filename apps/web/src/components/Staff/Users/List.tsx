import Loader from '@components/Shared/Loader';
import SearchUser from '@components/Shared/SearchUser';
import UserProfile from '@components/Shared/UserProfile';
import { ArrowPathIcon, UsersIcon } from '@heroicons/react/24/outline';
import type { ExploreProfilesRequest, Profile } from '@hey/lens';
import {
  ExploreProfilesOrderByType,
  LimitType,
  useExploreProfilesQuery
} from '@hey/lens';
import getProfile from '@hey/lib/getProfile';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { type FC, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';

const List: FC = () => {
  const { push } = useRouter();
  const [orderBy, setOrderBy] = useState<ExploreProfilesOrderByType>(
    ExploreProfilesOrderByType.LatestCreated
  );
  const [value, setValue] = useState('');

  // Variables
  const request: ExploreProfilesRequest = {
    orderBy,
    limit: LimitType.Fifty
  };

  const { data, loading, error, fetchMore, refetch } = useExploreProfilesQuery({
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
          value={value}
          placeholder="Search profiles..."
          onChange={(event) => setValue(event.target.value)}
          onProfileSelected={(profile) => push(getProfile(profile).staffLink)}
        />

        <select
          className="focus:border-brand-500 focus:ring-brand-400 rounded-xl border border-gray-300 bg-white outline-none dark:border-gray-700 dark:bg-gray-800"
          onChange={(e) =>
            setOrderBy(e.target.value as ExploreProfilesOrderByType)
          }
          defaultValue={orderBy}
        >
          {Object.values(ExploreProfilesOrderByType).map((orderBy) => (
            <option key={orderBy} value={orderBy}>
              {orderBy}
            </option>
          ))}
        </select>
        <button onClick={() => refetch()}>
          <ArrowPathIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="divider" />
      <div className="p-5">
        {loading ? (
          <Loader message="Loading profiles..." />
        ) : error ? (
          <ErrorMessage title="Failed to load profiles" error={error} />
        ) : !profiles?.length ? (
          <EmptyState
            message={<span>No profiles</span>}
            icon={<UsersIcon className="text-brand-500 h-8 w-8" />}
            hideCard
          />
        ) : (
          <Virtuoso
            useWindowScroll
            data={profiles}
            endReached={onEndReached}
            itemContent={(_, profile) => {
              return (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="pb-7"
                >
                  <Link href={getProfile(profile as Profile).staffLink}>
                    <UserProfile
                      profile={profile as Profile}
                      isBig
                      showUserPreview={false}
                      showBio
                      linkToProfile={false}
                      timestamp={profile.createdAt}
                    />
                  </Link>
                </motion.div>
              );
            }}
          />
        )}
      </div>
    </Card>
  );
};

export default List;
