import SinglePublication from "@components/Publication/SinglePublication";
import PublicationsShimmer from "@components/Shared/Shimmer/PublicationsShimmer";
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/outline";
import { HEY_API_URL } from "@hey/data/constants";
import type { AnyPublication, PublicationsRequest } from "@hey/lens";
import { LimitType, usePublicationsQuery } from "@hey/lens";
import type { List } from "@hey/types/hey";
import { Card, CardHeader, EmptyState, ErrorMessage } from "@hey/ui";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { FC } from "react";
import { useEffect, useRef } from "react";
import type { StateSnapshot, VirtuosoHandle } from "react-virtuoso";
import { Virtuoso } from "react-virtuoso";
import { useImpressionsStore } from "src/store/non-persisted/useImpressionsStore";
import { useTipsStore } from "src/store/non-persisted/useTipsStore";

let virtuosoState: any = { ranges: [], screenTop: 0 };

interface ListFeedProps {
  list: List;
}

const ListFeed: FC<ListFeedProps> = ({ list }) => {
  const { fetchAndStoreViews } = useImpressionsStore();
  const { fetchAndStoreTips } = useTipsStore();
  const virtuoso = useRef<VirtuosoHandle>(null);

  useEffect(() => {
    virtuosoState = { ranges: [], screenTop: 0 };
  }, [list.id]);

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
    queryKey: ["getListPublications", list.id],
    queryFn: () => getListPublications(list.id)
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

  const publications = publicationsData?.publications?.items || [];

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

  const Header = () => {
    return <CardHeader title={list.name} />;
  };

  if (publications?.length === 0) {
    return (
      <Card>
        <Header />
        <EmptyState
          icon={<ChatBubbleBottomCenterIcon className="size-8" />}
          message="No publications found"
          hideCard
        />
      </Card>
    );
  }

  if (errorPublicationIds || publicationsError) {
    return (
      <Card>
        <Header />
        <ErrorMessage
          error={errorPublicationIds || publicationsError}
          title="Failed to load list feed"
        />
      </Card>
    );
  }

  return (
    <Card>
      <Header />
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

export default ListFeed;
