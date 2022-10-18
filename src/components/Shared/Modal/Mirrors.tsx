import { useQuery } from '@apollo/client';
import UserProfile from '@components/Shared/UserProfile';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import InfiniteLoader from '@components/UI/InfiniteLoader';
import type { Profile } from '@generated/types';
import { MirrorsDocument } from '@generated/types';
import { SwitchHorizontalIcon } from '@heroicons/react/outline';
import type { FC } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { PAGINATION_THRESHOLD } from 'src/constants';

import Loader from '../Loader';

interface Props {
  publicationId: string;
}

const Mirrors: FC<Props> = ({ publicationId }) => {
  // Variables
  const request = { whoMirroredPublicationId: publicationId, limit: 10 };

  const { data, loading, error, fetchMore } = useQuery(MirrorsDocument, {
    variables: { request },
    skip: !publicationId
  });

  const profiles = data?.profiles?.items;
  const pageInfo = data?.profiles?.pageInfo;
  const hasMore = pageInfo?.next && profiles?.length !== pageInfo.totalCount;

  const loadMore = async () => {
    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    });
  };

  if (loading) {
    return <Loader message="Loading mirrors" />;
  }

  if (profiles?.length === 0) {
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
      <InfiniteScroll
        pageStart={0}
        threshold={PAGINATION_THRESHOLD}
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

export default Mirrors;
