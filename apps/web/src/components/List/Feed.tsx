import SinglePublication from "@components/Publication/SinglePublication";
import PublicationsShimmer from "@components/Shared/Shimmer/PublicationsShimmer";
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/outline";
import { HEY_API_URL } from "@hey/data/constants";
import type { AnyPublication, PublicationsRequest } from "@hey/lens";
import { LimitType, usePublicationsQuery } from "@hey/lens";
import { Card, EmptyState, ErrorMessage } from "@hey/ui";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { FC } from "react";
import { useEffect, useRef } from "react";
import type { StateSnapshot, VirtuosoHandle } from "react-virtuoso";
import { Virtuoso } from "react-virtuoso";
import { useImpressionsStore } from "src/store/non-persisted/useImpressionsStore";
import { useTipsStore } from "src/store/non-persisted/useTipsStore";

let virtuosoState: any = { ranges: [], screenTop: 0 };

interface FeedProps {
  id: string;
  name: string;
}

const Feed: FC<FeedProps> = ({ id, name }) => {
  const { fetchAndStoreViews } = useImpressionsStore();
  const { fetchAndStoreTips } = useTipsStore();
  const virtuoso = useRef<VirtuosoHandle>(null);

  useEffect(() => {
    virtuosoState = { ranges: [], screenTop: 0 };
  }, [id]);

  const getListPublications = async (id: string): Promise<string[]> => {
    try {
      const response = await axios.get(`${HEY_API_URL}/lists/publications`, {
        params: { id }
      });

      return response.data?.result;
    } catch {
      return [];
    }
  };

  const {
    data: publicationIds,
    isLoading: loadingPublicationIds,
    error: errorPublicationIds
  } = useQuery({
    queryKey: ["getListPublications", id],
    queryFn: () => getListPublications(id)
  });

  const request: PublicationsRequest = {
    limit: LimitType.TwentyFive,
    where: { publicationIds }
  };

  const {
    data: publicationsData,
    loading: publicationsLoading,
    error: publicationsError
  } = usePublicationsQuery({
    onCompleted: async ({ publications }) => {
      const ids =
        publications?.items?.map((p) => {
          return p.__typename === "Mirror" ? p.mirrorOn?.id : p.id;
        }) || [];
      await fetchAndStoreViews(ids);
      await fetchAndStoreTips(ids);
    },
    skip: !publicationIds?.length,
    variables: { request }
  });

  const publications = publicationsData?.publications?.items;

  const onScrolling = (scrolling: boolean) => {
    if (!scrolling) {
      virtuoso?.current?.getState((state: StateSnapshot) => {
        virtuosoState = { ...state };
      });
    }
  };

  if (loadingPublicationIds || publicationsLoading) {
    return <PublicationsShimmer />;
  }

  if (publications?.length === 0) {
    return (
      <EmptyState
        icon={<ChatBubbleBottomCenterIcon className="size-8" />}
        message={
          <div>
            <b className="mr-1">{name}</b>
            <span>has no posts yet!</span>
          </div>
        }
      />
    );
  }

  if (errorPublicationIds || publicationsError) {
    return (
      <ErrorMessage
        error={errorPublicationIds || publicationsError}
        title="Failed to load list feed"
      />
    );
  }

  return (
    <Card>
      <Virtuoso
        className="virtual-divider-list-window"
        computeItemKey={(index, publication) => `${publication.id}-${index}`}
        data={publications}
        isScrolling={onScrolling}
        itemContent={(index, publication) => (
          <SinglePublication
            isFirst={index === 0}
            isLast={index === (publications?.length || 0) - 1}
            publication={publication as AnyPublication}
          />
        )}
        ref={virtuoso}
        restoreStateFrom={
          virtuosoState.ranges.length === 0
            ? virtuosoState?.current?.getState((state: StateSnapshot) => state)
            : virtuosoState
        }
        useWindowScroll
      />
    </Card>
  );
};

export default Feed;
