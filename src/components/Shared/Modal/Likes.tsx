import { useQuery } from '@apollo/client';
import UserProfile from '@components/Shared/UserProfile';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Spinner } from '@components/UI/Spinner';
import type { Profile } from '@generated/types';
import { LikesDocument } from '@generated/types';
import { HeartIcon } from '@heroicons/react/outline';
import type { FC } from 'react';
import { useInView } from 'react-cool-inview';
import { PAGINATION_ROOT_MARGIN } from 'src/constants';

import Loader from '../Loader';

interface Props {
  publicationId: string;
}

const Likes: FC<Props> = ({ publicationId }) => {
  // Variables
  const request = { publicationId: publicationId, limit: 10 };

  const { data, loading, error, fetchMore } = useQuery(LikesDocument, {
    variables: { request },
    skip: !publicationId
  });

  const profiles = data?.whoReactedPublication?.items;
  const pageInfo = data?.whoReactedPublication?.pageInfo;

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView) {
        return;
      }

      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    },
    rootMargin: PAGINATION_ROOT_MARGIN
  });

  if (loading) {
    return <Loader message="Loading likes" />;
  }

  if (profiles?.length === 0) {
    return (
      <div className="p-5">
        <EmptyState
          message={<span>No likes.</span>}
          icon={<HeartIcon className="w-8 h-8 text-brand" />}
          hideCard
        />
      </div>
    );
  }

  return (
    <div className="overflow-y-auto max-h-[80vh]">
      <ErrorMessage className="m-5" title="Failed to load likes" error={error} />
      <div className="space-y-3">
        <div className="divide-y dark:divide-gray-700">
          {profiles?.map((like) => (
            <div className="p-5" key={like?.reactionId}>
              <UserProfile
                profile={like?.profile as Profile}
                showBio
                showFollow
                isFollowing={like?.profile?.isFollowedByMe}
              />
            </div>
          ))}
        </div>
        {pageInfo?.next && profiles?.length !== pageInfo.totalCount && (
          <span ref={observe} className="flex justify-center p-5">
            <Spinner size="md" />
          </span>
        )}
      </div>
    </div>
  );
};

export default Likes;
