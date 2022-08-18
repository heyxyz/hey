import { gql, useQuery } from '@apollo/client';
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout';
import NFTShimmer from '@components/Shared/Shimmer/NFTShimmer';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import Seo from '@components/utils/Seo';
import { Mixpanel } from '@lib/mixpanel';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { APP_NAME } from 'src/constants';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { useAppPersistStore } from 'src/store/app';
import { PAGEVIEW } from 'src/tracking';

import Cover from './Cover';
import Details from './Details';
import FeedType from './FeedType';
import ProfilePageShimmer from './Shimmer';

const Feed = dynamic(() => import('./Feed'), {
  loading: () => <PublicationsShimmer />
});
const NFTFeed = dynamic(() => import('./NFTFeed'), {
  loading: () => <NFTShimmer />
});

export const PROFILE_QUERY = gql`
  query Profile($request: SingleProfileQueryRequest!, $who: ProfileId) {
    profile(request: $request) {
      id
      handle
      ownedBy
      name
      bio
      metadata
      followNftAddress
      isFollowedByMe
      isFollowing(who: $who)
      attributes {
        key
        value
      }
      onChainIdentity {
        proofOfHumanity
        sybilDotOrg {
          verified
          source {
            twitter {
              handle
            }
          }
        }
        ens {
          name
        }
        worldcoin {
          isHuman
        }
      }
      stats {
        totalFollowers
        totalFollowing
        totalPosts
        totalComments
        totalMirrors
      }
      picture {
        ... on MediaSet {
          original {
            url
          }
        }
        ... on NftImage {
          uri
        }
      }
      coverPicture {
        ... on MediaSet {
          original {
            url
          }
        }
      }
      followModule {
        __typename
      }
    }
  }
`;

const ViewProfile: NextPage = () => {
  const {
    query: { username, type }
  } = useRouter();
  const currentUser = useAppPersistStore((state) => state.currentUser);
  const [feedType, setFeedType] = useState(
    type && ['post', 'comment', 'mirror', 'nft'].includes(type as string)
      ? type.toString().toUpperCase()
      : 'POST'
  );

  useEffect(() => {
    Mixpanel.track(PAGEVIEW.PROFILE);
  }, []);

  const { data, loading, error } = useQuery(PROFILE_QUERY, {
    variables: { request: { handle: username }, who: currentUser?.id ?? null },
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
      <Cover cover={profile?.coverPicture?.original?.url} />
      <GridLayout className="pt-6">
        <GridItemFour>
          <Details profile={profile} />
        </GridItemFour>
        <GridItemEight className="space-y-5">
          <FeedType stats={profile?.stats} setFeedType={setFeedType} feedType={feedType} />
          {(feedType === 'POST' || feedType === 'COMMENT' || feedType === 'MIRROR') && (
            <Feed profile={profile} type={feedType} />
          )}
          {feedType === 'NFT' && <NFTFeed profile={profile} />}
        </GridItemEight>
      </GridLayout>
    </>
  );
};

export default ViewProfile;
