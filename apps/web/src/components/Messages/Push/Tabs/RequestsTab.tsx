import Loader from '@components/Shared/Loader';
import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer';
import React, { useEffect, useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import usePushHooks from 'src/hooks/messaging/push/usePush';
import { usePushChatStore } from 'src/store/persisted/usePushChatStore';

import Profile from '../Header/Profile';

export default function PUSHPreviewRequests() {
  const { useGetChatRequests } = usePushHooks();
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useGetChatRequests();

  const requestsFeed = usePushChatStore((state) => state.requestsFeed);
  const updateRequestsFeed = usePushChatStore(
    (state) => state.updateRequestsFeed
  );

  const requests = useMemo(() => {
    return data?.pages.flatMap(
      (page) => page?.sort((a, b) => b!.msg!.timestamp! - a!.msg!.timestamp!)
    );
  }, [data?.pages]);

  const updateRequests = async () => {
    if (!requests) {
      return;
    }
    const combinedRequests = [...requestsFeed, ...requests];
    const dedupedRequests = combinedRequests.filter(
      (request, index, self) =>
        index === self.findIndex((t) => t.did === request.did)
    );
    if (dedupedRequests.length > 0) {
      updateRequestsFeed(dedupedRequests);
    }
  };

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage && !isFetching) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    updateRequests();
  }, [data?.pages]);

  return isFetching ? (
    <>{Array(8).fill(<UserProfileShimmer />)}</>
  ) : (
    <Virtuoso
      className="h-full"
      components={{
        EmptyPlaceholder: () => {
          return (
            <div className="flex h-full flex-grow items-center justify-center">
              No requests yet
            </div>
          );
        },
        Footer: () => {
          return hasNextPage && isFetchingNextPage ? (
            <div className="flex h-full items-center justify-center">
              <Loader message="Loading more requests..." />
            </div>
          ) : null;
        }
      }}
      data={requests}
      endReached={loadMore}
      itemContent={(_index, request) => {
        return <Profile key={request.chatId} previewMessage={request} />;
      }}
    />
  );
}
