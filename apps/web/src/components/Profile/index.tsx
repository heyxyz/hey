import type { Profile } from '@hey/lens';
import type { NextPage } from 'next';

import MetaTags from '@components/Common/MetaTags';
import NewPost from '@components/Composer/Post/New';
import { NoSymbolIcon } from '@heroicons/react/24/outline';
import {
  APP_NAME,
  HANDLE_PREFIX,
  HEY_API_URL,
  STATIC_IMAGES_URL
} from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import { useProfileQuery } from '@hey/lens';
import getProfile from '@hey/lib/getProfile';
import { EmptyState, GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ProfileFeedType } from 'src/enums';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import Cover from './Cover';
import Details from './Details';
import Feed from './Feed';
import FeedType from './FeedType';
import Followers from './Followers';
import Following from './Following';
import MutualFollowersList from './MutualFollowers/List';
import ProfilePageShimmer from './Shimmer';

const ViewProfile: NextPage = () => {
  const {
    isReady,
    pathname,
    query: { handle, id, source, type }
  } = useRouter();
  const { currentProfile } = useProfileStore();

  const showFollowing = pathname === '/u/[handle]/following';
  const showFollowers = pathname === '/u/[handle]/followers';
  const showMutuals = pathname === '/u/[handle]/mutuals';

  useEffect(() => {
    if (isReady) {
      Leafwatch.track(PAGEVIEW, {
        page: 'profile',
        subpage: pathname.replace('/u/[handle]', ''),
        ...(source ? { source } : {})
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handle, id]);

  const lowerCaseProfileFeedType = [
    ProfileFeedType.Feed.toLowerCase(),
    ProfileFeedType.Replies.toLowerCase(),
    ProfileFeedType.Media.toLowerCase(),
    ProfileFeedType.Collects.toLowerCase()
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

  const fetchProfileFlags = async () => {
    try {
      const response = await axios.get(`${HEY_API_URL}/profile/flags`, {
        params: { id: profile.id }
      });

      return response.data.result;
    } catch {
      return false;
    }
  };

  const { data: profileFlags } = useQuery({
    enabled: Boolean(profile?.id),
    queryFn: fetchProfileFlags,
    queryKey: ['fetchProfileFlags', id]
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

  return (
    <>
      <MetaTags
        title={`${getProfile(profile).displayName} (${
          getProfile(profile).slugWithPrefix
        }) • ${APP_NAME}`}
      />
      <Cover
        cover={
          profile?.metadata?.coverPicture?.optimized?.uri ||
          `${STATIC_IMAGES_URL}/patterns/2.svg`
        }
      />
      <GridLayout>
        <GridItemFour>
          <Details profile={profile as Profile} />
        </GridItemFour>
        <GridItemEight className="space-y-5">
          {profileFlags?.isSuspended ? (
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
              ) : null}
            </>
          )}
        </GridItemEight>
      </GridLayout>
    </>
  );
};

export default ViewProfile;
