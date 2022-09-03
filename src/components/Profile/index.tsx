import { gql, useQuery } from '@apollo/client';
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout';
import Seo from '@components/utils/Seo';
import { Hog } from '@lib/hog';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { APP_NAME } from 'src/constants';
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
      dispatcher {
        canUseRelay
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
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [feedType, setFeedType] = useState(
    type && ['feed', 'replies', 'media', 'nft'].includes(type as string)
      ? type.toString().toUpperCase()
      : 'FEED'
  );

  useEffect(() => {
    Hog.track(PAGEVIEW.PROFILE);
  }, []);

  const { data, loading, error } = useQuery(PROFILE_QUERY, {
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
      <Cover cover={profile?.coverPicture?.original?.url} />
      <GridLayout className="pt-6">
        <GridItemFour>
          <Details profile={profile} />
        </GridItemFour>
        <GridItemEight className="space-y-5">
          <FeedType stats={profile?.stats} setFeedType={setFeedType} feedType={feedType} />
          {(feedType === 'FEED' || feedType === 'REPLIES' || feedType === 'MEDIA') && (
            <Feed profile={profile} type={feedType} />
          )}
          {feedType === 'NFT' && <NFTFeed profile={profile} />}
        </GridItemEight>
      </GridLayout>
    </>
  );
};

export default ViewProfile;
