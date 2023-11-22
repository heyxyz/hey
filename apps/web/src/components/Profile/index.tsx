import MetaTags from '@components/Common/MetaTags';
import NewPost from '@components/Composer/Post/New';
import {
  APP_NAME,
  HANDLE_PREFIX,
  IS_MAINNET,
  STATIC_IMAGES_URL
} from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import type { Profile } from '@hey/lens';
import { FollowModuleType, useProfileQuery } from '@hey/lens';
import getProfile from '@hey/lib/getProfile';
import { GridItemEight, GridItemFour, GridLayout, Modal } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Custom500 from 'src/app/500';
import Custom404 from 'src/app/not-found';
import { ProfileFeedType } from 'src/enums';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useEffectOnce, useUpdateEffect } from 'usehooks-ts';

import Achievements from './Achievements';
import Cover from './Cover';
import Details from './Details';
import Feed from './Feed';
import FeedType from './FeedType';
import FollowDialog from './FollowDialog';
import NftGallery from './NftGallery';
import ProfilePageShimmer from './Shimmer';

const ViewProfile: NextPage = () => {
  const {
    query: { handle, id, type, followIntent },
    isReady
  } = useRouter();
  const currentProfile = useProfileStore((state) => state.currentProfile);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'profile' });
  });

  const lowerCaseProfileFeedType = [
    ProfileFeedType.Feed.toLowerCase(),
    ProfileFeedType.Replies.toLowerCase(),
    ProfileFeedType.Media.toLowerCase(),
    ProfileFeedType.Collects.toLowerCase(),
    ProfileFeedType.Gallery.toLowerCase(),
    ProfileFeedType.Stats.toLowerCase()
  ];

  const feedType = type
    ? lowerCaseProfileFeedType.includes(type as string)
      ? type.toString().toUpperCase()
      : ProfileFeedType.Feed
    : ProfileFeedType.Feed;

  const { data, loading, error } = useProfileQuery({
    variables: {
      request: {
        ...(id
          ? { forProfileId: id }
          : { forHandle: `${HANDLE_PREFIX}${handle}` })
      }
    },
    skip: id ? !id : !handle
  });

  const profile = data?.profile as Profile;
  const [following, setFollowing] = useState<boolean | null>(null);
  const [showFollowModal, setShowFollowModal] = useState(false);
  const isFollowedByMe =
    Boolean(currentProfile) &&
    Boolean(profile?.operations.isFollowedByMe.value);

  const followType = profile?.followModule?.type;
  const initState = following === null;
  // profile is not defined until the second render
  if (initState && profile) {
    const canFollow =
      followType !== FollowModuleType.RevertFollowModule && !isFollowedByMe;
    if (followIntent && canFollow) {
      setShowFollowModal(true);
    }
    setFollowing(isFollowedByMe);
  }

  // Profile changes when user selects a new profile from search box
  useUpdateEffect(() => {
    if (profile) {
      setFollowing(null);
    }
  }, [profile]);

  useUpdateEffect(() => {
    if (following) {
      setShowFollowModal(false);
    }
  }, [following]);

  if (!isReady || loading) {
    return <ProfilePageShimmer />;
  }

  if (!data?.profile) {
    return <Custom404 />;
  }

  if (error) {
    return <Custom500 />;
  }

  return (
    <>
      <Modal show={showFollowModal} onClose={() => setShowFollowModal(false)}>
        <FollowDialog
          profile={profile as Profile}
          setFollowing={setFollowing}
          setShowFollowModal={setShowFollowModal}
        />
      </Modal>
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
      <GridLayout className="pt-6">
        <GridItemFour>
          <Details
            profile={profile as Profile}
            following={Boolean(following)}
            setFollowing={setFollowing}
          />
        </GridItemFour>
        <GridItemEight className="space-y-5">
          <FeedType feedType={feedType} />
          {currentProfile?.id === profile?.id ? <NewPost /> : null}
          {feedType === ProfileFeedType.Feed ||
          feedType === ProfileFeedType.Replies ||
          feedType === ProfileFeedType.Media ||
          feedType === ProfileFeedType.Collects ? (
            <Feed profile={profile as Profile} type={feedType} />
          ) : null}
          {feedType === ProfileFeedType.Gallery ? (
            <NftGallery profile={profile as Profile} />
          ) : null}
          {feedType === ProfileFeedType.Stats && IS_MAINNET ? (
            <Achievements profile={profile as Profile} />
          ) : null}
        </GridItemEight>
      </GridLayout>
    </>
  );
};

export default ViewProfile;
