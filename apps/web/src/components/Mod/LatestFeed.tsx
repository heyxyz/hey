import type {
  AnyPublication,
  CustomFiltersType,
  MirrorablePublication,
  ModExplorePublicationRequest,
  ModExplorePublicationType,
  PublicationMetadataMainFocusType
} from '@hey/lens';
import type { FC } from 'react';

import GardenerActions from '@components/Publication/Actions/GardenerActions';
import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
import { IS_MAINNET } from '@hey/data/constants';
import {
  ExplorePublicationsOrderByType,
  LimitType,
  useModExplorePublicationsQuery
} from '@hey/lens';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import { useEffect } from 'react';
import { Virtuoso } from 'react-virtuoso';

const SKIPPED_PROFILE_IDS = IS_MAINNET ? ['0x027290'] : [];

interface LatestFeedProps {
  apps: null | string[];
  customFilters: CustomFiltersType[];
  mainContentFocus: PublicationMetadataMainFocusType[];
  publicationTypes: ModExplorePublicationType[];
  refresh: boolean;
  setRefreshing: (refreshing: boolean) => void;
}

const LatestFeed: FC<LatestFeedProps> = ({
  apps,
  customFilters,
  mainContentFocus,
  publicationTypes,
  refresh,
  setRefreshing
}) => {
  // Variables
  const request: ModExplorePublicationRequest = {
    limit: LimitType.Fifty,
    orderBy: ExplorePublicationsOrderByType.Latest,
    where: {
      customFilters,
      metadata: {
        mainContentFocus,
        ...(apps && { publishedOn: apps })
      },
      publicationTypes
    }
  };

  const { data, error, fetchMore, loading, refetch } =
    useModExplorePublicationsQuery({ variables: { request } });

  const publications = data?.modExplorePublications?.items;
  const pageInfo = data?.modExplorePublications?.pageInfo;
  const hasMore = pageInfo?.next;

  useEffect(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, publicationTypes, mainContentFocus, customFilters]);

  const onEndReached = async () => {
    if (!hasMore) {
      return;
    }

    return await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    });
  };

  if (loading) {
    return <PublicationsShimmer />;
  }

  if (publications?.length === 0) {
    return (
      <EmptyState
        icon={<RectangleStackIcon className="size-8" />}
        message="No posts yet!"
      />
    );
  }

  if (error) {
    return (
      <ErrorMessage error={error} title="Failed to load moderation feed" />
    );
  }

  return (
    <Virtuoso
      className="[&>div>div]:space-y-5"
      components={{ Footer: () => <div className="pb-5" /> }}
      computeItemKey={(index, publication) => `${publication.id}-${index}`}
      data={publications?.filter(
        (publication) =>
          !SKIPPED_PROFILE_IDS.includes(publication?.by?.id as string)
      )}
      endReached={onEndReached}
      itemContent={(index, publication) => {
        return (
          <Card>
            <SinglePublication
              isFirst
              isLast={false}
              publication={publication as AnyPublication}
              showActions={false}
              showThread={false}
            />
            <div className="divider" />
            <div className="m-5">
              <GardenerActions
                publication={publication as MirrorablePublication}
              />
            </div>
          </Card>
        );
      }}
      useWindowScroll
    />
  );
};

export default LatestFeed;
