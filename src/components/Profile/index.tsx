import { useQuery } from '@apollo/client';
import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import Seo from '@components/utils/Seo';
import { ProfileDocument } from '@generated/documents';
import { Mixpanel } from '@lib/mixpanel';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { APP_NAME, STATIC_ASSETS } from 'src/constants';
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

  useEffect(() => {
    Mixpanel.track('Pageview', { path: PAGEVIEW.PROFILE });
  }, []);

  const { data, loading, error } = useQuery(ProfileDocument, {
    variables: { request: { handle: username }, who: currentProfile?.id ?? null },
    skip: !username
  });

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
        <Seo title={`${profile?.name} (@${profile?.handle}) • ${APP_NAME}`} />
      ) : (
        <Seo title={`@${profile?.handle} • ${APP_NAME}`} />
      )}
      <Cover
        cover={
          profile?.coverPicture?.__typename === 'MediaSet'
            ? profile?.coverPicture?.original?.url
            : `${STATIC_ASSETS}/patterns/2.svg`
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
