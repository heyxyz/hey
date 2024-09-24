import ProfileListShimmer from "@components/Shared/Shimmer/ProfileListShimmer";
import UserProfile from "@components/Shared/UserProfile";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { ProfileLinkSource } from "@hey/data/tracking";
import type { Profile, WhoActedOnPublicationRequest } from "@hey/lens";
import {
  LimitType,
  OpenActionCategoryType,
  useWhoActedOnPublicationQuery
} from "@hey/lens";
import { EmptyState, ErrorMessage } from "@hey/ui";
import type { FC } from "react";
import { Virtuoso } from "react-virtuoso";
import { useProfileStore } from "src/store/persisted/useProfileStore";

interface CollectorsProps {
  publicationId: string;
}

const Collectors: FC<CollectorsProps> = ({ publicationId }) => {
  const { currentProfile } = useProfileStore();

  const request: WhoActedOnPublicationRequest = {
    limit: LimitType.TwentyFive,
    on: publicationId,
    where: { anyOf: [{ category: OpenActionCategoryType.Collect }] }
  };

  const { data, error, fetchMore, loading } = useWhoActedOnPublicationQuery({
    skip: !publicationId,
    variables: { request }
  });

  const profiles = data?.whoActedOnPublication?.items;
  const pageInfo = data?.whoActedOnPublication?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  };

  if (loading) {
    return <ProfileListShimmer />;
  }

  if (profiles?.length === 0) {
    return (
      <div className="p-5">
        <EmptyState
          icon={<ShoppingBagIcon className="size-8" />}
          message="No collectors."
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
        title="Failed to load collectors"
      />
    );
  }

  return (
    <Virtuoso
      className="virtual-profile-list"
      computeItemKey={(index, profile) => `${profile.id}-${index}`}
      data={profiles}
      endReached={onEndReached}
      itemContent={(_, profile) => (
        <div className="p-5">
          <UserProfile
            hideFollowButton={currentProfile?.id === profile.id}
            hideUnfollowButton={currentProfile?.id === profile.id}
            profile={profile as Profile}
            showBio
            showUserPreview={false}
            source={ProfileLinkSource.Collects}
          />
        </div>
      )}
    />
  );
};

export default Collectors;
