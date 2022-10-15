import { useQuery } from '@apollo/client';
import Loader from '@components/Shared/Loader';
import UserProfile from '@components/Shared/UserProfile';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import InfiniteLoader from '@components/UI/InfiniteLoader';
import type { Profile } from '@generated/types';
import { MutualFollowersListDocument } from '@generated/types';
import type { FC } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { PAGINATION_ROOT_MARGIN } from 'src/constants';
import { useAppStore } from 'src/store/app';

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
  const hasMore = pageInfo?.next && profiles?.length !== pageInfo.totalCount;

  const loadMore = async () => {
    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    });
  };

  if (loading) {
    return <Loader message="Loading mutual followers" />;
  }

  return (
    <div className="overflow-y-auto max-h-[80vh]">
      <ErrorMessage className="m-5" title="Failed to load mutual followers" error={error} />
      <InfiniteScroll
        pageStart={0}
        threshold={PAGINATION_ROOT_MARGIN}
        hasMore={hasMore}
        loadMore={loadMore}
        loader={<InfiniteLoader />}
        useWindow={false}
      >
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
      </InfiniteScroll>
    </div>
  );
};

export default MutualFollowersList;
