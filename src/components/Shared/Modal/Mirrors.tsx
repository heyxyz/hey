import { gql, useQuery } from '@apollo/client';
import UserProfile from '@components/Shared/UserProfile';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Spinner } from '@components/UI/Spinner';
import { Profile } from '@generated/types';
import { ProfileFields } from '@gql/ProfileFields';
import { SwitchHorizontalIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import { FC } from 'react';
import { useInView } from 'react-cool-inview';
import { PAGINATION_ROOT_MARGIN } from 'src/constants';
import { PAGINATION } from 'src/tracking';

import Loader from '../Loader';

const MIRRORS_QUERY = gql`
  query Mirrors($request: ProfileQueryRequest!) {
    profiles(request: $request) {
      items {
        ...ProfileFields
        isFollowedByMe
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

const Mirrors: FC<Props> = ({ pubId }) => {
  // Variables
  const request = { whoMirroredPublicationId: pubId, limit: 10 };

  const { data, loading, error, fetchMore } = useQuery(MIRRORS_QUERY, {
    variables: { request },
    skip: !pubId
  });

  const pageInfo = data?.profiles?.pageInfo;
  const { observe } = useInView({
    onEnter: async () => {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
      Mixpanel.track(PAGINATION.MIRRORS);
    },
    rootMargin: PAGINATION_ROOT_MARGIN
  });

  if (loading) {
    return <Loader message="Loading mirrors" />;
  }

  if (data?.profiles?.items?.length === 0) {
    return (
      <div className="p-5">
        <EmptyState
          message={<span>No mirrors.</span>}
          icon={<SwitchHorizontalIcon className="w-8 h-8 text-brand" />}
          hideCard
        />
      </div>
    );
  }

  return (
    <div className="overflow-y-auto max-h-[80vh]">
      <ErrorMessage className="m-5" title="Failed to load mirrors" error={error} />
      <div className="space-y-3">
        <div className="divide-y dark:divide-gray-700">
          {data?.profiles?.items?.map((profile: Profile) => (
            <div className="p-5" key={profile?.id}>
              <UserProfile profile={profile} showBio showFollow isFollowing={profile?.isFollowedByMe} />
            </div>
          ))}
        </div>
        {pageInfo?.next && data?.profiles?.items?.length !== pageInfo?.totalCount && (
          <span ref={observe} className="flex justify-center p-5">
            <Spinner size="md" />
          </span>
        )}
      </div>
    </div>
  );
};

export default Mirrors;
