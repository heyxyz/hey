import PublicationsShimmer from "@components/Shared/Shimmer/PublicationsShimmer";
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/outline";
import {
  type AnyPublication,
  CustomFiltersType,
  type ExplorePublicationRequest,
  ExplorePublicationsOrderByType,
  LimitType,
  PublicationMetadataMainFocusType,
  useExplorePublicationsQuery
} from "@hey/lens";
import { EmptyState, ErrorMessage } from "@hey/ui";
import type { FC } from "react";
import { useImpressionsStore } from "src/store/non-persisted/useImpressionsStore";
import { useTipsStore } from "src/store/non-persisted/useTipsStore";
import SingleImagePublication from "./SingleImagePublication";

interface ImageFeedProps {
  feedType: ExplorePublicationsOrderByType;
}

const ImageFeed: FC<ImageFeedProps> = ({
  feedType = ExplorePublicationsOrderByType.LensCurated
}) => {
  const { fetchAndStoreViews } = useImpressionsStore();
  const { fetchAndStoreTips } = useTipsStore();

  const request: ExplorePublicationRequest = {
    limit: LimitType.TwentyFive,
    orderBy: feedType,
    where: {
      customFilters: [CustomFiltersType.Gardeners],
      metadata: {
        mainContentFocus: [PublicationMetadataMainFocusType.Image]
      }
    }
  };

  const { data, error, loading } = useExplorePublicationsQuery({
    onCompleted: async ({ explorePublications }) => {
      const ids = explorePublications?.items?.map((p) => p.id) || [];
      await fetchAndStoreViews(ids);
      await fetchAndStoreTips(ids);
    },
    variables: { request }
  });

  const publications = data?.explorePublications?.items;

  if (loading) {
    return <PublicationsShimmer />;
  }

  if (publications?.length === 0) {
    return (
      <EmptyState
        icon={<ChatBubbleBottomCenterIcon className="size-8" />}
        message="No posts yet!"
      />
    );
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load explore feed" />;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {publications?.map((publication) => (
        <SingleImagePublication
          key={publication.id}
          publication={publication as AnyPublication}
        />
      ))}
    </div>
  );
};

export default ImageFeed;
