import UserProfile from '@components/Shared/UserProfile';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { HeartIcon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import { SCROLL_THRESHOLD } from 'data/constants';
import type { Profile, WhoReactedPublicationRequest } from 'lens';
import { useLikesQuery } from 'lens';
import type { FC } from 'react';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { FollowSource } from '../Follow';
import Loader from '../Loader';

interface LikesProps {
  publicationId: string;
}

const Likes: FC<LikesProps> = ({ publicationId }) => {
  const [hasMore, setHasMore] = useState(true);

  // Variables
  const request: WhoReactedPublicationRequest = { publicationId: publicationId, limit: 10 };

  const { data, loading, error, fetchMore } = useLikesQuery({
    variables: { request },
    skip: !publicationId
  });

  const profiles = data?.whoReactedPublication?.items;
  const pageInfo = data?.whoReactedPublication?.pageInfo;

  const loadMore = async () => {
    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    }).then(({ data }) => {
      setHasMore(data?.whoReactedPublication?.items?.length > 0);
    });
  };

  if (loading) {
    return <Loader message={t`Loading likes`} />;
  }

  if (profiles?.length === 0) {
    return (
      <div className="p-5">
        <EmptyState message={t`No likes.`} icon={<HeartIcon className="text-brand h-8 w-8" />} hideCard />
      </div>
    );
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto" id="scrollableLikesDiv">
      <ErrorMessage className="m-5" title={t`Failed to load likes`} error={error} />
      <InfiniteScroll
        dataLength={profiles?.length ?? 0}
        scrollThreshold={SCROLL_THRESHOLD}
        hasMore={hasMore}
        next={loadMore}
        loader={<span />}
        scrollableTarget="scrollableLikesDiv"
      >
        <div className="divide-y dark:divide-gray-700">
          {profiles?.map((like, index) => (
            <div className="p-5" key={like?.reactionId}>
              <UserProfile
                profile={like?.profile as Profile}
                isFollowing={like?.profile?.isFollowedByMe}
                followPosition={index + 1}
                followSource={FollowSource.LIKES_MODAL}
                showBio
                showFollow
                showUserPreview={false}
              />
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Likes;
