import MetaTags from '@components/Common/MetaTags';
import NftFeed from '@components/Nft/NftFeed';
import { useFeature } from '@growthbook/growthbook-react';
import { Mixpanel } from '@lib/mixpanel';
import { FeatureFlag } from 'data';
import { APP_NAME, STATIC_IMAGES_URL } from 'data/constants';
import type { Profile } from 'lens';
import { useProfileQuery } from 'lens';
import formatHandle from 'lib/formatHandle';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ProfileFeedType } from 'src/enums';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { useAppStore } from 'src/store/app';
import { PAGEVIEW } from 'src/tracking';
import { GridItemEight, GridItemFour, GridLayout, Modal } from 'ui';

import Cover from './Cover';
import Details from './Details';
import Feed from './Feed';
import FeedType from './FeedType';
import FollowDialog from './FollowDialog';
import NftGallery from './NftGallery';
import ProfilePageShimmer from './Shimmer';

const ViewProfile: NextPage = () => {
  const {
    query: { username, type, followIntent }
  } = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [feedType, setFeedType] = useState(
    type && ['feed', 'replies', 'media', 'collects', 'nft'].includes(type as string)
      ? type.toString().toUpperCase()
      : ProfileFeedType.Feed
  );
  const { on: isNftGalleryEnabled } = useFeature(FeatureFlag.NftGallery as string);

  useEffect(() => {
    Mixpanel.track(PAGEVIEW, { page: 'profile' });
  }, []);

  const handle = formatHandle(username as string, true);
  const { data, loading, error } = useProfileQuery({
    variables: { request: { handle }, who: currentProfile?.id ?? null },
    skip: !handle
  });

  const profile = data?.profile;
  const [following, setFollowing] = useState<boolean | null>(null);
  const [showFollowModal, setShowFollowModal] = useState(false);
  const isFollowedByMe = Boolean(currentProfile) && Boolean(profile?.isFollowedByMe);

  const followType = profile?.followModule?.__typename;

  const initState = following === null;
  // profile is not defined until the second render
  if (initState && profile) {
    const canFollow = followType !== 'RevertFollowModuleSettings' && !isFollowedByMe;
    if (followIntent && canFollow) {
      setShowFollowModal(true);
    }
    setFollowing(isFollowedByMe);
  }

  // profile changes when user selects a new profile from search box
  useEffect(() => {
    if (profile) {
      setFollowing(null);
    }
  }, [profile]);

  useEffect(() => {
    if (following) {
      setShowFollowModal(false);
    }
  }, [following]);

  if (error) {
    return <Custom500 />;
  }

  if (loading || !data) {
    return <ProfilePageShimmer />;
  }

  if (!data?.profile) {
    return <Custom404 />;
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
      {profile?.name ? (
        <MetaTags title={`${profile?.name} (@${formatHandle(profile?.handle)}) • ${APP_NAME}`} />
      ) : (
        <MetaTags title={`@${formatHandle(profile?.handle)} • ${APP_NAME}`} />
      )}
      <Cover
        cover={
          profile?.coverPicture?.__typename === 'MediaSet'
            ? profile?.coverPicture?.original?.url
            : `${STATIC_IMAGES_URL}/patterns/2.svg`
        }
      />
      <GridLayout className="pt-6">
        <GridItemFour>
          <Details profile={profile as Profile} following={Boolean(following)} setFollowing={setFollowing} />
        </GridItemFour>
        <GridItemEight className="space-y-5">
          <FeedType setFeedType={setFeedType} feedType={feedType} />
          {(feedType === ProfileFeedType.Feed ||
            feedType === ProfileFeedType.Replies ||
            feedType === ProfileFeedType.Media ||
            feedType === ProfileFeedType.Collects) && <Feed profile={profile as Profile} type={feedType} />}
          {feedType === ProfileFeedType.Nft ? (
            isNftGalleryEnabled ? (
              <NftGallery profile={profile as Profile} />
            ) : (
              <NftFeed profile={profile as Profile} />
            )
          ) : null}
        </GridItemEight>
      </GridLayout>
    </>
  );
};

export default ViewProfile;
