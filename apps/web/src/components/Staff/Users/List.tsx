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
import { Button, Card, EmptyState, ErrorMessage, Modal, Select } from '@hey/ui';
import cn from '@hey/ui/cn';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Virtuoso } from 'react-virtuoso';

import ProfileFeed from './ProfileFeed';

const List: FC = () => {
  const { pathname, push } = useRouter();
  const [orderBy, setOrderBy] = useState<ExploreProfilesOrderByType>(
    ExploreProfilesOrderByType.LatestCreated
  );
  const [value, setValue] = useState('');
  const [refetching, setRefetching] = useState(false);
  const [showPublicationsModal, setShowPublicationsModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<null | Profile>(null);

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
              setShowPublicationsModal(true);
              setSelectedProfile(profile as Profile);
              setValue('');
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
            data={profiles}
            endReached={onEndReached}
            itemContent={(_, profile) => {
              return (
                <motion.div
                  animate={{ opacity: 1 }}
                  className="flex flex-wrap items-center justify-between gap-y-5 pb-7"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                >
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
                  <div className="flex items-center space-x-1">
                    <Button
                      onClick={() => {
                        setShowPublicationsModal(true);
                        setSelectedProfile(profile as Profile);
                      }}
                      outline
                      size="sm"
                      variant="secondary"
                    >
                      Publications
                    </Button>
                    <P2PRecommendation profile={profile as Profile} />
                  </div>
                </motion.div>
              );
            }}
            useWindowScroll
          />
        )}
      </div>
      <Modal
        onClose={() => {
          setShowPublicationsModal(false);
          setSelectedProfile(null);
        }}
        show={showPublicationsModal}
        size="md"
        title={`Publications by ${getProfile(selectedProfile).slugWithPrefix}`}
      >
        <div className="max-h-[80vh] overflow-y-auto">
          {selectedProfile?.id ? (
            <ProfileFeed profileId={selectedProfile.id} />
          ) : null}
        </div>
      </Modal>
    </Card>
  );
};

export default List;
