import SingleImagePost from "@components/Post/SingleImagePost";
import ImagePostsShimmer from "@components/Shared/Shimmer/ImagePostsShimmer";
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

interface ImageFeedProps {
  feedType: ExplorePublicationsOrderByType;
}

const ImageFeed: FC<ImageFeedProps> = ({
  feedType = ExplorePublicationsOrderByType.LensCurated
}) => {
  const { fetchAndStoreViews } = useImpressionsStore();
  const { fetchAndStoreTips } = useTipsStore();

  const request: ExplorePublicationRequest = {
    limit: LimitType.Fifty,
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

  const posts = data?.explorePublications?.items;

  if (loading) {
    return <ImagePostsShimmer />;
  }

  if (posts?.length === 0) {
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
      {posts?.map((post) => (
        <SingleImagePost key={post.id} post={post as AnyPublication} />
      ))}
    </div>
  );
};

export default ImageFeed;
