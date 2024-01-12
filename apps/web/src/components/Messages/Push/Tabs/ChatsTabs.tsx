import Loader from '@components/Shared/Loader';
import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer';
import React from 'react';
import { Virtuoso } from 'react-virtuoso';
import usePushHooks from 'src/hooks/messaging/push/usePush';

import Profile from '../Header/Profile';

export default function PUSHPreviewChats() {
  const { useGetChats } = usePushHooks();
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useGetChats();

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage && !isFetching) {
      fetchNextPage();
    }
  };

  const chats = data?.pages.flatMap(
    (page) => page?.sort((a, b) => b!.msg!.timestamp! - a!.msg!.timestamp!)
  );

  return isFetching ? (
    <>{Array(8).fill(<UserProfileShimmer />)}</>
  ) : (
    <Virtuoso
      className="h-full"
      components={{
        EmptyPlaceholder: () => {
          return (
            <div className="flex h-full flex-grow items-center justify-center">
              No chats yet
            </div>
          );
        },
        Footer: () => {
          return hasNextPage && isFetchingNextPage ? (
            <div className="flex h-full items-center justify-center">
              <Loader message="Loading more messages..." />
            </div>
          ) : null;
        }
      }}
      data={chats}
      endReached={loadMore}
      itemContent={(_index, message) => {
        return <Profile key={message.chatId} previewMessage={message} />;
      }}
    />
  );
}
