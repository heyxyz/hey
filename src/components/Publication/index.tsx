import { gql, useQuery } from '@apollo/client';
import Feed from '@components/Comment/Feed';
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout';
import Footer from '@components/Shared/Footer';
import UserProfile from '@components/Shared/UserProfile';
import PublicationStaffTool from '@components/StaffTools/Panels/Publication';
import { Card, CardBody } from '@components/UI/Card';
import useStaffMode from '@components/utils/hooks/useStaffMode';
import Seo from '@components/utils/Seo';
import { LensterPublication } from '@generated/lenstertypes';
import { CommentFields } from '@gql/CommentFields';
import { MirrorFields } from '@gql/MirrorFields';
import { PostFields } from '@gql/PostFields';
import { Hog } from '@lib/hog';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { APP_NAME } from 'src/constants';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { useAppStore } from 'src/store/app';
import { PAGEVIEW } from 'src/tracking';

import FullPublication from './FullPublication';
import OnchainMeta from './OnchainMeta';
import RelevantPeople from './RelevantPeople';
import PublicationPageShimmer from './Shimmer';

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
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { allowed: staffMode } = useStaffMode();

  useEffect(() => {
    Hog.track('Pageview', { page: PAGEVIEW.PUBLICATION });
  }, []);

  const {
    query: { id }
  } = useRouter();

  const { data, loading, error } = useQuery(PUBLICATION_QUERY, {
    variables: {
      request: { publicationId: id },
      reactionRequest: currentProfile ? { profileId: currentProfile?.id } : null,
      profileId: currentProfile?.id ?? null
    },
    skip: !id
  });

  if (error) {
    return <Custom500 />;
  }

  if (loading || !data) {
    return <PublicationPageShimmer />;
  }

  if (!data.publication) {
    return <Custom404 />;
  }

  const publication: LensterPublication = data.publication;

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
        <Card as="aside">
          <CardBody>
            <UserProfile
              profile={
                publication?.__typename === 'Mirror' ? publication?.mirrorOf?.profile : publication?.profile
              }
              showBio
            />
          </CardBody>
        </Card>
        <RelevantPeople publication={publication} />
        <OnchainMeta publication={publication} />
        {staffMode && <PublicationStaffTool publication={publication} />}
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default ViewPublication;
