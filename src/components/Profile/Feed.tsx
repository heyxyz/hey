import { gql, useQuery } from '@apollo/client';
import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { Card } from '@components/UI/Card';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Spinner } from '@components/UI/Spinner';
import { LensterPublication } from '@generated/lenstertypes';
import { Profile, PublicationMainFocus, PublicationTypes } from '@generated/types';
import { CommentFields } from '@gql/CommentFields';
import { MirrorFields } from '@gql/MirrorFields';
import { PostFields } from '@gql/PostFields';
import { CollectionIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import React, { FC } from 'react';
import { useInView } from 'react-cool-inview';
import { useAppStore } from 'src/store/app';
import { PAGINATION } from 'src/tracking';

const PROFILE_FEED_QUERY = gql`
  query ProfileFeed(
    $request: PublicationsQueryRequest!
    $reactionRequest: ReactionFieldResolverRequest
    $profileId: ProfileId
  ) {
    publications(request: $request) {
      items {
        ... on Post {
          ...PostFields
        }
        ... on Comment {
          ...CommentFields
        }
        ... on Mirror {
          ...MirrorFields
        }
      }
      pageInfo {
        totalCount
        next
      }
    }
  }
  ${PostFields}
  ${CommentFields}
  ${MirrorFields}
`;

interface Props {
  profile: Profile;
  type: 'FEED' | 'REPLIES' | 'MEDIA';
}

const Feed: FC<Props> = ({ profile, type }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  // Variables
  const publicationTypes =
    type === 'FEED'
      ? [PublicationTypes.Post, PublicationTypes.Mirror]
      : type === 'MEDIA'
      ? [PublicationTypes.Post, PublicationTypes.Comment]
      : [PublicationTypes.Comment];
  const metadata =
    type === 'MEDIA'
      ? {
          mainContentFocus: [
            PublicationMainFocus.Video,
            PublicationMainFocus.Image,
            PublicationMainFocus.Audio
          ]
        }
      : null;
  const request = { publicationTypes, metadata, profileId: profile?.id, limit: 10 };
  const reactionRequest = currentProfile ? { profileId: currentProfile?.id } : null;
  const profileId = currentProfile?.id ?? null;

  const { data, loading, error, fetchMore } = useQuery(PROFILE_FEED_QUERY, {
    variables: { request, reactionRequest, profileId },
    skip: !profile?.id
  });

  const pageInfo = data?.publications?.pageInfo;
  const { observe } = useInView({
    onEnter: () => {
      fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next }, reactionRequest, profileId }
      });
      Mixpanel.track(PAGINATION.PROFILE_FEED);
    }
  });

  return (
    <>
      {loading && <PublicationsShimmer />}
      {data?.publications?.items?.length === 0 && (
        <EmptyState
          message={
            <div>
              <span className="mr-1 font-bold">@{profile?.handle}</span>
              <span>doesn’t {type.toLowerCase()}ed yet!</span>
            </div>
          }
          icon={<CollectionIcon className="w-8 h-8 text-brand" />}
        />
      )}
      <ErrorMessage title="Failed to load profile feed" error={error} />
      {!error && !loading && data?.publications?.items?.length !== 0 && (
        <>
          <Card className="divide-y-[1px] dark:divide-gray-700/80">
            {data?.publications?.items?.map((post: LensterPublication, index: number) => (
              <SinglePublication
                key={`${post?.id}_${index}`}
                publication={post}
                showThread={type !== 'MEDIA'}
              />
            ))}
          </Card>
          {pageInfo?.next && data?.publications?.items?.length !== pageInfo?.totalCount && (
            <span ref={observe} className="flex justify-center p-5">
              <Spinner size="sm" />
            </span>
          )}
        </>
      )}
    </>
  );
};

export default Feed;
