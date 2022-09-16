import { gql, useQuery } from '@apollo/client';
import UserProfile from '@components/Shared/UserProfile';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Spinner } from '@components/UI/Spinner';
import { WhoReactedResult } from '@generated/types';
import { ProfileFields } from '@gql/ProfileFields';
import { HeartIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import { FC } from 'react';
import { useInView } from 'react-cool-inview';
import { PAGINATION_ROOT_MARGIN } from 'src/constants';
import { PAGINATION } from 'src/tracking';

import Loader from '../Loader';

const LIKES_QUERY = gql`
  query Likes($request: WhoReactedPublicationRequest!) {
    whoReactedPublication(request: $request) {
      items {
        reactionId
        profile {
          ...ProfileFields
          isFollowedByMe
        }
      }
      pageInfo {
        next
        totalCount
      }
    }
  }
  ${ProfileFields}
`;

interface Props {
  pubId: string;
}

const Likes: FC<Props> = ({ pubId }) => {
  // Variables
  const request = { publicationId: pubId, limit: 10 };

  const { data, loading, error, fetchMore } = useQuery(LIKES_QUERY, {
    variables: { request },
    skip: !pubId
  });

  const pageInfo = data?.whoReactedPublication?.pageInfo;
  const { observe } = useInView({
    onEnter: () => {
      fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
      Mixpanel.track(PAGINATION.LIKES);
    },
    rootMargin: PAGINATION_ROOT_MARGIN
  });

  if (loading) {
    return <Loader message="Loading likes" />;
  }

  if (data?.whoReactedPublication?.items?.length === 0) {
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
          {data?.whoReactedPublication?.items?.map((like: WhoReactedResult) => (
            <div className="p-5" key={like?.reactionId}>
              <UserProfile
                profile={like?.profile}
                showBio
                showFollow
                isFollowing={like?.profile?.isFollowedByMe}
              />
            </div>
          ))}
        </div>
        {pageInfo?.next && data?.whoReactedPublication?.items?.length !== pageInfo?.totalCount && (
          <span ref={observe} className="flex justify-center p-5">
            <Spinner size="md" />
          </span>
        )}
      </div>
    </div>
  );
};

export default Likes;
