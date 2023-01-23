import MetaTags from '@components/Common/MetaTags';
import Follow from '@components/Shared/Follow';
import Slug from '@components/Shared/Slug';
import SuperFollow from '@components/Shared/SuperFollow';
import { Button } from '@components/UI/Button';
import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import { Modal } from '@components/UI/Modal';
import formatHandle from '@lib/formatHandle';
import getAvatar from '@lib/getAvatar';
import { t, Trans } from '@lingui/macro';
import { APP_NAME, STATIC_IMAGES_URL } from 'data/constants';
import { useProfileQuery } from 'lens';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { useAppStore } from 'src/store/app';

import Cover from './Cover';
import Details from './Details';
import Feed, { ProfileFeedType } from './Feed';
import FeedType from './FeedType';
import NFTFeed from './NFTFeed';
import ProfilePageShimmer from './Shimmer';

const ViewProfile: NextPage = () => {
  const {
    query: { username, type, showFollowDialog }
  } = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [feedType, setFeedType] = useState(
    type && ['feed', 'replies', 'media', 'collects', 'nft'].includes(type as string)
      ? type.toString().toUpperCase()
      : ProfileFeedType.Feed
  );

  const handle = formatHandle(username as string, true);
  const { data, loading, error } = useProfileQuery({
    variables: { request: { handle }, who: currentProfile?.id ?? null },
    skip: !handle
  });

  const profile = data?.profile;
  const [following, setFollowing] = useState<boolean | null>(null);
  const [showFollowModal, setShowFollowModal] = useState(false);

  // workaround for that profile.isFollowedByMe == true when signed out
  const isFollowedByMe = !!currentProfile && !!profile?.isFollowedByMe;

  const followType = profile?.followModule?.__typename;

  const initState = following == null;
  // profile is not defined until the second render
  if (initState && profile) {
    const canFollow = followType !== 'RevertFollowModuleSettings' && !isFollowedByMe;
    if (showFollowDialog && canFollow) {
      setShowFollowModal(true);
    }
    setFollowing(isFollowedByMe);
  }

  // profile changes when user selects a new profile from search box
  useEffect(() => {
    if (profile != undefined) {
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
        <div className="p-5">
          <div className="flex text-lg font-bold justify-between">
            <span className="flex">
              <img
                onError={({ currentTarget }) => {
                  currentTarget.src = getAvatar(profile, false);
                }}
                src={getAvatar(profile)}
                className="h-10 w-10 bg-gray-200 rounded-full border dark:border-gray-700 mr-2"
                alt={formatHandle(profile?.handle)}
              />
              <Slug className="flex items-center" slug={formatHandle(profile?.handle)} prefix="@" />{' '}
            </span>
            <span className="flex">
              {followType === 'FeeFollowModuleSettings' ? (
                <div className="flex space-x-2">
                  <SuperFollow profile={profile as any} setFollowing={setFollowing} showText />
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Follow profile={profile as any} setFollowing={setFollowing} showText outline={false} />
                </div>
              )}
              <Button
                className="text-sm !px-3 !py-1.5 ml-3"
                outline
                onClick={() => {
                  setShowFollowModal(false);
                }}
                aria-label={t`Not now`}
              >
                <Trans>Not now</Trans>
              </Button>
            </span>
          </div>
        </div>
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
          <Details profile={profile as any} following={!!following} setFollowing={setFollowing} />
        </GridItemFour>
        <GridItemEight className="space-y-5">
          <FeedType setFeedType={setFeedType} feedType={feedType} />
          {(feedType === ProfileFeedType.Feed ||
            feedType === ProfileFeedType.Replies ||
            feedType === ProfileFeedType.Media ||
            feedType === ProfileFeedType.Collects) && <Feed profile={profile as any} type={feedType} />}
          {feedType === ProfileFeedType.Nft && <NFTFeed profile={profile as any} />}
        </GridItemEight>
      </GridLayout>
    </>
  );
};

export default ViewProfile;
