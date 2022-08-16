import { gql, useQuery } from '@apollo/client';
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout';
import Footer from '@components/Shared/Footer';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import UserProfile from '@components/Shared/UserProfile';
import { Card, CardBody } from '@components/UI/Card';
import Seo from '@components/utils/Seo';
import { LensterPublication } from '@generated/lenstertypes';
import { CommentFields } from '@gql/CommentFields';
import { MirrorFields } from '@gql/MirrorFields';
import { PostFields } from '@gql/PostFields';
import { Mixpanel } from '@lib/mixpanel';
import { apps } from 'data/apps';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { APP_NAME } from 'src/constants';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { useAppPersistStore } from 'src/store/app';
import { PAGEVIEW } from 'src/tracking';

import FullPublication from './FullPublication';
import OnchainMeta from './OnchainMeta';
import RelevantPeople from './RelevantPeople';
import PublicationPageShimmer from './Shimmer';
import ViaApp from './ViaApp';

const Feed = dynamic(() => import('@components/Comment/Feed'), {
  loading: () => <PublicationsShimmer />
});

export const PUBLICATION_QUERY = gql`
  query Publication(
    $request: PublicationQueryRequest!
    $reactionRequest: ReactionFieldResolverRequest
    $profileId: ProfileId
  ) {
    publication(request: $request) {
      ... on Post {
        ...PostFields
        onChainContentURI
        collectNftAddress
        profile {
          isFollowedByMe
        }
        referenceModule {
          __typename
        }
      }
      ... on Comment {
        ...CommentFields
        onChainContentURI
        collectNftAddress
        profile {
          isFollowedByMe
        }
        referenceModule {
          __typename
        }
      }
      ... on Mirror {
        ...MirrorFields
        onChainContentURI
        collectNftAddress
        profile {
          isFollowedByMe
        }
        referenceModule {
          __typename
        }
      }
    }
  }
  ${PostFields}
  ${CommentFields}
  ${MirrorFields}
`;

const ViewPublication: NextPage = () => {
  const { push } = useRouter();

  useEffect(() => {
    Mixpanel.track(PAGEVIEW.PUBLICATION);
  }, []);

  const {
    query: { id }
  } = useRouter();

  const currentUser = useAppPersistStore((state) => state.currentUser);
  const { data, loading, error } = useQuery(PUBLICATION_QUERY, {
    variables: {
      request: { publicationId: id },
      reactionRequest: currentUser ? { profileId: currentUser?.id } : null,
      profileId: currentUser?.id ?? null
    },
    skip: !id,
    onCompleted(data) {
      const isCommunity = data?.publication?.metadata?.attributes[0]?.value === 'community';
      if (isCommunity) {
        push(`/communities/${data.publication?.id}`);
      }
    }
  });

  if (error) return <Custom500 />;
  if (loading || !data) return <PublicationPageShimmer />;
  if (!data.publication) return <Custom404 />;

  const publication: LensterPublication = data.publication;
  const appConfig = apps.filter((e) => e.id === publication?.appId)[0];

  return (
    <GridLayout>
      <Seo
        title={
          publication?.__typename && publication?.profile?.handle
            ? `${publication.__typename} by @${publication.profile.handle} • ${APP_NAME}`
            : APP_NAME
        }
      />
      <GridItemEight className="space-y-5">
        <Card>
          <FullPublication publication={publication} />
        </Card>
        <Feed
          publication={publication}
          onlyFollowers={publication?.referenceModule?.__typename === 'FollowOnlyReferenceModuleSettings'}
          isFollowing={publication?.profile?.isFollowedByMe}
        />
      </GridItemEight>
      <GridItemFour className="space-y-5">
        <Card>
          <CardBody>
            <UserProfile
              profile={
                publication?.__typename === 'Mirror' ? publication?.mirrorOf?.profile : publication?.profile
              }
              showBio
            />
          </CardBody>
          <ViaApp appConfig={appConfig} />
        </Card>
        <RelevantPeople publication={publication} />
        <OnchainMeta publication={publication} />
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default ViewPublication;
