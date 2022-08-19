import { gql, useQuery } from '@apollo/client';
import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { Card } from '@components/UI/Card';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Spinner } from '@components/UI/Spinner';
import { LensterPublication } from '@generated/lenstertypes';
import { PaginatedResultInfo } from '@generated/types';
import { CommentFields } from '@gql/CommentFields';
import { CollectionIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import React, { FC, useState } from 'react';
import { useInView } from 'react-cool-inview';
import { useAppStore } from 'src/store/app';
import { PAGINATION } from 'src/tracking';

import ReferenceAlert from '../Shared/ReferenceAlert';
import NewComment from './New';

const COMMENT_FEED_QUERY = gql`
  query CommentFeed(
    $request: PublicationsQueryRequest!
    $reactionRequest: ReactionFieldResolverRequest
    $profileId: ProfileId
  ) {
    publications(request: $request) {
      items {
        ... on Comment {
          ...CommentFields
        }
      }
      pageInfo {
        totalCount
        next
      }
    }
  }
  ${CommentFields}
`;

interface Props {
  publication: LensterPublication;
  type?: 'comment' | 'community post';
  onlyFollowers?: boolean;
  isFollowing?: boolean;
}

const Feed: FC<Props> = ({ publication, type = 'comment', onlyFollowers = false, isFollowing = true }) => {
  const pubId = publication?.__typename === 'Mirror' ? publication?.mirrorOf?.id : publication?.id;
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [publications, setPublications] = useState<LensterPublication[]>([]);
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>();
  const { data, loading, error, fetchMore } = useQuery(COMMENT_FEED_QUERY, {
    variables: {
      request: { commentsOf: pubId, limit: 10 },
      reactionRequest: currentProfile ? { profileId: currentProfile?.id } : null,
      profileId: currentProfile?.id ?? null
    },
    skip: !pubId,
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      setPageInfo(data?.publications?.pageInfo);
      setPublications(data?.publications?.items);
    }
  });

  const { observe } = useInView({
    onEnter: async () => {
      const { data } = await fetchMore({
        variables: {
          request: {
            commentsOf: pubId,
            cursor: pageInfo?.next,
            limit: 10
          },
          reactionRequest: currentProfile ? { profileId: currentProfile?.id } : null,
          profileId: currentProfile?.id ?? null
        }
      });
      setPageInfo(data?.publications?.pageInfo);
      setPublications([...publications, ...data?.publications?.items]);
      Mixpanel.track(type === 'comment' ? PAGINATION.COMMENT_FEED : PAGINATION.COMMUNITY_FEED, { pageInfo });
    }
  });

  return (
    <>
      {currentProfile &&
        (isFollowing || !onlyFollowers ? (
          <NewComment publication={publication} type={type} />
        ) : (
          <ReferenceAlert
            handle={publication?.profile?.handle}
            isSuperFollow={publication?.profile?.followModule?.__typename === 'FeeFollowModuleSettings'}
            action="comment"
          />
        ))}
      {loading && <PublicationsShimmer />}
      {data?.publications?.items?.length === 0 && (
        <EmptyState
          message={<span>Be the first one to comment!</span>}
          icon={<CollectionIcon className="w-8 h-8 text-brand" />}
        />
      )}
      <ErrorMessage title="Failed to load comment feed" error={error} />
      {!error && !loading && data?.publications?.items?.length !== 0 && (
        <>
          <Card className="divide-y-[1px] dark:divide-gray-700/80">
            {publications?.map((post: LensterPublication, index: number) => (
              <SinglePublication key={`${pubId}_${index}`} publication={post} showType={false} />
            ))}
          </Card>
          {pageInfo?.next && publications.length !== pageInfo?.totalCount && (
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
