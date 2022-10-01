import { useQuery } from '@apollo/client';
import Loader from '@components/Shared/Loader';
import UserProfile from '@components/Shared/UserProfile';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Spinner } from '@components/UI/Spinner';
import { MutualFollowersListDocument, Profile } from '@generated/types';
import { Mixpanel } from '@lib/mixpanel';
import { FC } from 'react';
import { useInView } from 'react-cool-inview';
import { PAGINATION_ROOT_MARGIN } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { PAGINATION } from 'src/tracking';

interface Props {
  profileId: string;
}

const MutualFollowersList: FC<Props> = ({ profileId }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  // Variables
  const request = {
    viewingProfileId: profileId,
    yourProfileId: currentProfile?.id,
    limit: 10
  };

  const { data, loading, error, fetchMore } = useQuery(MutualFollowersListDocument, {
    variables: { request },
    skip: !profileId
  });

  const profiles = data?.mutualFollowersProfiles?.items;
  const pageInfo = data?.mutualFollowersProfiles?.pageInfo;

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView) {
        return;
      }

      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
      Mixpanel.track(PAGINATION.MUTUAL_FOLLOWERS);
    },
    rootMargin: PAGINATION_ROOT_MARGIN
  });

  if (loading) {
    return <Loader message="Loading mutual followers" />;
  }

  return (
    <div className="overflow-y-auto max-h-[80vh]">
      <ErrorMessage className="m-5" title="Failed to load mutual followers" error={error} />
      <div className="space-y-3">
        <div className="divide-y dark:divide-gray-700">
          {profiles?.map((profile) => (
            <div className="p-5" key={profile?.id}>
              <UserProfile
                profile={profile as Profile}
                showBio
                showFollow
                isFollowing={profile?.isFollowedByMe}
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

export default MutualFollowersList;
