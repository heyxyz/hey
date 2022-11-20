import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import MetaTags from '@components/utils/MetaTags';
import { Leafwatch } from '@lib/leafwatch';
import { APP_NAME, STATIC_IMAGES_URL } from 'data/constants';
import { useProfileQuery } from 'lens';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { useAppStore } from 'src/store/app';
import { PAGEVIEW } from 'src/tracking';

import Cover from './Cover';
import Details from './Details';
import Feed from './Feed';
import FeedType from './FeedType';
import NFTFeed from './NFTFeed';
import ProfilePageShimmer from './Shimmer';

const ViewProfile: NextPage = () => {
  const {
    query: { username, type }
  } = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [feedType, setFeedType] = useState(
    type && ['feed', 'replies', 'media', 'nft'].includes(type as string)
      ? type.toString().toUpperCase()
      : 'FEED'
  );

  const { data, loading, error } = useProfileQuery({
    variables: { request: { handle: username }, who: currentProfile?.id ?? null },
    skip: !username
  });

  useEffect(() => {
    if (data?.profile?.id) {
      Leafwatch.track('Pageview', {
        path: PAGEVIEW.PROFILE,
        id: data.profile.id
      });
    }
  }, [data]);

  if (error) {
    return <Custom500 />;
  }

  if (loading || !data) {
    return <ProfilePageShimmer />;
  }

  if (!data?.profile) {
    return <Custom404 />;
  }

  const profile = data?.profile;

  return (
    <>
      {profile?.name ? (
        <MetaTags title={`${profile?.name} (@${profile?.handle}) • ${APP_NAME}`} />
      ) : (
        <MetaTags title={`@${profile?.handle} • ${APP_NAME}`} />
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
          <Details profile={profile as any} />
        </GridItemFour>
        <GridItemEight className="space-y-5">
          <FeedType stats={profile?.stats as any} setFeedType={setFeedType} feedType={feedType} />
          {(feedType === 'FEED' || feedType === 'REPLIES' || feedType === 'MEDIA') && (
            <Feed profile={profile as any} type={feedType} />
          )}
          {feedType === 'NFT' && <NFTFeed profile={profile as any} />}
        </GridItemEight>
      </GridLayout>
    </>
  );
};

export default ViewProfile;
