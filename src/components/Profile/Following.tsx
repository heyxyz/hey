import { gql, useQuery } from '@apollo/client';
import Loader from '@components/Shared/Loader';
import UserProfile from '@components/Shared/UserProfile';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Spinner } from '@components/UI/Spinner';
import { Following, Profile } from '@generated/types';
import { ProfileFields } from '@gql/ProfileFields';
import { UsersIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import { FC } from 'react';
import { useInView } from 'react-cool-inview';
import { PAGINATION_ROOT_MARGIN } from 'src/constants';
import { PAGINATION } from 'src/tracking';

const FOLLOWING_QUERY = gql`
  query Following($request: FollowingRequest!) {
    following(request: $request) {
      items {
        profile {
          ...ProfileFields
          isFollowedByMe
        }
        totalAmountOfTimesFollowing
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
  profile: Profile;
}

const Following: FC<Props> = ({ profile }) => {
  // Variables
  const request = { address: profile?.ownedBy, limit: 10 };

  const { data, loading, error, fetchMore } = useQuery(FOLLOWING_QUERY, {
    variables: { request },
    skip: !profile?.id
  });

  const pageInfo = data?.following?.pageInfo;
  const { observe } = useInView({
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: { ...request, cursor: pageInfo?.next }
        }
      });
      Mixpanel.track(PAGINATION.FOLLOWING);
    },
    rootMargin: PAGINATION_ROOT_MARGIN
  });

  if (loading) {
    return <Loader message="Loading following" />;
  }

  if (data?.following?.items?.length === 0) {
    return (
      <EmptyState
        message={
          <div>
            <span className="mr-1 font-bold">@{profile?.handle}</span>
            <span>doesn’t follow anyone.</span>
          </div>
        }
        icon={<UsersIcon className="w-8 h-8 text-brand" />}
        hideCard
      />
    );
  }

  return (
    <div className="overflow-y-auto max-h-[80vh]">
      <ErrorMessage className="m-5" title="Failed to load following" error={error} />
      <div className="space-y-3">
        <div className="divide-y dark:divide-gray-700">
          {data?.following?.items?.map((following: Following) => (
            <div className="p-5" key={following?.profile?.id}>
              <UserProfile
                profile={following?.profile}
                showBio
                showFollow
                isFollowing={following?.profile?.isFollowedByMe}
              />
            </div>
          ))}
        </div>
        {pageInfo?.next && data?.following?.items?.length !== pageInfo?.totalCount && (
          <span ref={observe} className="flex justify-center p-5">
            <Spinner size="md" />
          </span>
        )}
      </div>
    </div>
  );
};

export default Following;
