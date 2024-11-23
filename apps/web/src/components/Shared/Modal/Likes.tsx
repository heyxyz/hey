import AccountListShimmer from "@components/Shared/Shimmer/AccountListShimmer";
import SingleAccount from "@components/Shared/SingleAccount";
import { HeartIcon } from "@heroicons/react/24/outline";
import { AccountLinkSource } from "@hey/data/tracking";
import {
  LimitType,
  type Profile,
  type WhoReactedPublicationRequest,
  useWhoReactedPublicationQuery
} from "@hey/lens";
import { EmptyState, ErrorMessage } from "@hey/ui";
import type { FC } from "react";
import { Virtuoso } from "react-virtuoso";
import { useAccountStore } from "src/store/persisted/useAccountStore";

interface LikesProps {
  postId: string;
}

const Likes: FC<LikesProps> = ({ postId }) => {
  const { currentAccount } = useAccountStore();

  const request: WhoReactedPublicationRequest = {
    for: postId,
    limit: LimitType.TwentyFive
  };

  const { data, error, fetchMore, loading } = useWhoReactedPublicationQuery({
    skip: !postId,
    variables: { request }
  });

  const profiles = data?.whoReactedPublication?.items;
  const pageInfo = data?.whoReactedPublication?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  };

  if (loading) {
    return <AccountListShimmer />;
  }

  if (profiles?.length === 0) {
    return (
      <div className="p-5">
        <EmptyState
          icon={<HeartIcon className="size-8" />}
          message="No likes."
          hideCard
        />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        className="m-5"
        error={error}
        title="Failed to load likes"
      />
    );
  }

  return (
    <Virtuoso
      className="virtual-account-list"
      computeItemKey={(index, like) => `${like.profile.id}-${index}`}
      data={profiles}
      endReached={onEndReached}
      itemContent={(_, like) => (
        <div className="p-5">
          <SingleAccount
            hideFollowButton={currentAccount?.id === like.profile.id}
            hideUnfollowButton={currentAccount?.id === like.profile.id}
            account={like.profile as Profile}
            showBio
            showUserPreview={false}
            source={AccountLinkSource.Likes}
          />
        </div>
      )}
    />
  );
};

export default Likes;
