import type { Profile } from '@hey/lens';
import type { NextPage } from 'next';

import MetaTags from '@components/Common/MetaTags';
import NewPost from '@components/Composer/Post/New';
import { NoSymbolIcon } from '@heroicons/react/24/outline';
import {
  APP_NAME,
  HANDLE_PREFIX,
  STATIC_IMAGES_URL
} from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import { useProfileQuery } from '@hey/lens';
import getProfileFlags from '@hey/lib/api/getProfileFlags';
import getProfile from '@hey/lib/getProfile';
import { EmptyState, GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ProfileFeedType } from 'src/enums';
import { Leafwatch } from 'src/helpers/leafwatch';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import Cover from './Cover';
import Details from './Details';
import Feed from './Feed';
import FeedType from './FeedType';
import Followers from './Followers';
import Following from './Following';
import MutualFollowersList from './MutualFollowers/List';
import ProfilePageShimmer from './Shimmer';
import Stats from './Stats';
import SuspendedDetails from './SuspendedDetails';

const ViewProfile: NextPage = () => {
  const {
    isReady,
    pathname,
    query: { handle, id, source, type }
  } = useRouter();
  const { currentProfile } = useProfileStore();
  const { staffMode } = useFeatureFlagsStore();

  const showFollowing =
    pathname === '/u/[handle]/following' ||
    pathname === '/profile/[id]/following';
  const showFollowers =
    pathname === '/u/[handle]/followers' ||
    pathname === '/profile/[id]/followers';
  const showMutuals =
    pathname === '/u/[handle]/mutuals' || pathname === '/profile/[id]/mutuals';

  useEffect(() => {
    if (isReady) {
      Leafwatch.track(PAGEVIEW, {
        page: 'profile',
        subpage: pathname
          .replace('/u/[handle]', '')
          .replace('/profile/[id]', ''),
        ...(source ? { source } : {})
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handle, id]);

  const lowerCaseProfileFeedType = [
    ProfileFeedType.Feed.toLowerCase(),
    ProfileFeedType.Replies.toLowerCase(),
    ProfileFeedType.Media.toLowerCase(),
    ProfileFeedType.Collects.toLowerCase(),
    ProfileFeedType.Stats.toLowerCase()
  ];

  const feedType = type
    ? lowerCaseProfileFeedType.includes(type as string)
      ? type.toString().toUpperCase()
      : ProfileFeedType.Feed
    : ProfileFeedType.Feed;

  const { data, error, loading } = useProfileQuery({
    skip: id ? !id : !handle,
    variables: {
      request: {
        ...(id
          ? { forProfileId: id }
          : { forHandle: `${HANDLE_PREFIX}${handle}` })
      }
    }
  });

  const profile = data?.profile as Profile;

  const { data: profileFlags } = useQuery({
    enabled: Boolean(profile?.id),
    queryFn: () => getProfileFlags(profile?.id || ''),
    queryKey: ['getProfileFlags', id]
  });

  if (!isReady || loading) {
    return (
      <ProfilePageShimmer
        profileList={showFollowing || showFollowers || showMutuals}
      />
    );
  }

  if (!data?.profile) {
    return <Custom404 />;
  }

  if (error) {
    return <Custom500 />;
  }

  const isSuspended = staffMode ? false : profileFlags?.isSuspended;

  return (
    <>
      <MetaTags
        creator={getProfile(profile).displayName}
        description={profile.metadata?.bio}
        title={`${getProfile(profile).displayName} (${
          getProfile(profile).slugWithPrefix
        }) • ${APP_NAME}`}
      />
      <Cover
        cover={
          isSuspended
            ? `${STATIC_IMAGES_URL}/patterns/2.svg`
            : profile?.metadata?.coverPicture?.optimized?.uri ||
              `${STATIC_IMAGES_URL}/patterns/2.svg`
        }
      />
      <GridLayout>
        <GridItemFour>
          {isSuspended ? (
            <SuspendedDetails profile={profile as Profile} />
          ) : (
            <Details
              isSuspended={profileFlags?.isSuspended || false}
              profile={profile as Profile}
            />
          )}
        </GridItemFour>
        <GridItemEight className="space-y-5">
          {isSuspended ? (
            <EmptyState
              icon={<NoSymbolIcon className="size-8" />}
              message="Profile Suspended"
            />
          ) : showFollowing ? (
            <Following
              handle={getProfile(profile).slug}
              profileId={profile.id}
            />
          ) : showFollowers ? (
            <Followers
              handle={getProfile(profile).slug}
              profileId={profile.id}
            />
          ) : showMutuals ? (
            <MutualFollowersList
              handle={getProfile(profile).slug}
              profileId={profile.id}
            />
          ) : (
            <>
              <FeedType feedType={feedType} />
              {currentProfile?.id === profile?.id ? <NewPost /> : null}
              {feedType === ProfileFeedType.Feed ||
              feedType === ProfileFeedType.Replies ||
              feedType === ProfileFeedType.Media ||
              feedType === ProfileFeedType.Collects ? (
                <Feed
                  handle={getProfile(profile).slugWithPrefix}
                  profileId={profile.id}
                  type={feedType}
                />
              ) : feedType === ProfileFeedType.Stats ? (
                <Stats profileId={profile.id} />
              ) : null}
            </>
          )}
        </GridItemEight>
      </GridLayout>
    </>
  );
};

export default ViewProfile;
