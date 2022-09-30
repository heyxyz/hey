import { useQuery } from '@apollo/client';
import Loader from '@components/Shared/Loader';
import UserProfile from '@components/Shared/UserProfile';
import WalletProfile from '@components/Shared/WalletProfile';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Spinner } from '@components/UI/Spinner';
import { FollowersDocument, Profile } from '@generated/documents';
import { UsersIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import { FC } from 'react';
import { useInView } from 'react-cool-inview';
import { PAGINATION_ROOT_MARGIN } from 'src/constants';
import { PAGINATION } from 'src/tracking';

interface Props {
  profile: Profile;
}

const Followers: FC<Props> = ({ profile }) => {
  // Variables
  const request = { profileId: profile?.id, limit: 10 };

  const { data, loading, error, fetchMore } = useQuery(FollowersDocument, {
    variables: { request },
    skip: !profile?.id
  });

  const followers = data?.followers?.items;
  const pageInfo = data?.followers?.pageInfo;

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView) {
        return;
      }

      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
      Mixpanel.track(PAGINATION.FOLLOWERS);
    },
    rootMargin: PAGINATION_ROOT_MARGIN
  });

  if (loading) {
    return <Loader message="Loading followers" />;
  }

  if (followers?.length === 0) {
    return (
      <EmptyState
        message={
          <div>
            <span className="mr-1 font-bold">@{profile?.handle}</span>
            <span>doesn’t have any followers yet.</span>
          </div>
        }
        icon={<UsersIcon className="w-8 h-8 text-brand" />}
        hideCard
      />
    );
  }

  return (
    <div className="overflow-y-auto max-h-[80vh]">
      <ErrorMessage className="m-5" title="Failed to load followers" error={error} />
      <div className="space-y-3">
        <div className="divide-y dark:divide-gray-700">
          {followers?.map((follower: any) => (
            <div className="p-5" key={follower?.wallet?.defaultProfile?.id}>
              {follower?.wallet?.defaultProfile ? (
                <UserProfile
                  profile={follower?.wallet?.defaultProfile}
                  showBio
                  showFollow
                  isFollowing={follower?.wallet?.defaultProfile?.isFollowedByMe}
                />
              ) : (
                <WalletProfile wallet={follower?.wallet} />
              )}
            </div>
          ))}
        </div>
        {pageInfo?.next && followers?.length !== pageInfo?.totalCount && (
          <span ref={observe} className="flex justify-center p-5">
            <Spinner size="md" />
          </span>
        )}
      </div>
    </div>
  );
};

export default Followers;
