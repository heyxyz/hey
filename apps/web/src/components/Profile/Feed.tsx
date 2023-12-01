import { ProfileFeedType } from '@enums';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
import type { AnyPublication, Profile, PublicationsRequest } from '@hey/lens';
import {
  LimitType,
  PublicationMetadataMainFocusType,
  PublicationType,
  usePublicationsQuery
} from '@hey/lens';
import getProfile from '@hey/lib/getProfile';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import { type FC } from 'react';
import { useInView } from 'react-cool-inview';

import SinglePublication from '@/components/Publication/SinglePublication';
import PublicationsShimmer from '@/components/Shared/Shimmer/PublicationsShimmer';
import { useImpressionsStore } from '@/store/non-persisted/useImpressionsStore';
import { useProfileFeedStore } from '@/store/non-persisted/useProfileFeedStore';

interface FeedProps {
  profile: Profile;
  type:
    | ProfileFeedType.Feed
    | ProfileFeedType.Replies
    | ProfileFeedType.Media
    | ProfileFeedType.Collects;
}

const Feed: FC<FeedProps> = ({ profile, type }) => {
  const mediaFeedFilters = useProfileFeedStore(
    (state) => state.mediaFeedFilters
  );
  const fetchAndStoreViews = useImpressionsStore(
    (state) => state.fetchAndStoreViews
  );

  const getMediaFilters = () => {
    const filters: PublicationMetadataMainFocusType[] = [];
    if (mediaFeedFilters.images) {
      filters.push(PublicationMetadataMainFocusType.Image);
    }
    if (mediaFeedFilters.video) {
      filters.push(PublicationMetadataMainFocusType.Video);
    }
    if (mediaFeedFilters.audio) {
      filters.push(PublicationMetadataMainFocusType.Audio);
    }
    return filters;
  };

  // Variables
  const publicationTypes: PublicationType[] =
    type === ProfileFeedType.Feed
      ? [PublicationType.Post, PublicationType.Mirror, PublicationType.Quote]
      : type === ProfileFeedType.Replies
        ? [PublicationType.Comment]
        : type === ProfileFeedType.Media
          ? [
              PublicationType.Post,
              PublicationType.Comment,
              PublicationType.Quote
            ]
          : [
              PublicationType.Post,
              PublicationType.Comment,
              PublicationType.Mirror
            ];
  const metadata =
    type === ProfileFeedType.Media
      ? { mainContentFocus: getMediaFilters() }
      : null;
  const request: PublicationsRequest = {
    where: {
      publicationTypes,
      metadata,
      ...(type !== ProfileFeedType.Collects
        ? { from: profile?.id }
        : { actedBy: profile?.id })
    },
    limit: LimitType.TwentyFive
  };

  const { data, loading, error, fetchMore } = usePublicationsQuery({
    variables: { request },
    skip: !profile?.id,
    onCompleted: async ({ publications }) => {
      const ids =
        publications?.items?.map((p) => {
          return p.__typename === 'Mirror' ? p.mirrorOn?.id : p.id;
        }) || [];
      await fetchAndStoreViews(ids);
    }
  });

  const publications = data?.publications?.items;
  const pageInfo = data?.publications?.pageInfo;
  const hasMore = pageInfo?.next;

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView || !hasMore) {
        return;
      }

      const { data } = await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
      const ids =
        data?.publications?.items?.map((p) => {
          return p.__typename === 'Mirror' ? p.mirrorOn?.id : p.id;
        }) || [];
      await fetchAndStoreViews(ids);
    }
  });

  if (loading) {
    return <PublicationsShimmer />;
  }

  if (publications?.length === 0) {
    const emptyMessage =
      type === ProfileFeedType.Feed
        ? 'has nothing in their feed yet!'
        : type === ProfileFeedType.Media
          ? 'has no media yet!'
          : type === ProfileFeedType.Replies
            ? "hasn't replied yet!"
            : type === ProfileFeedType.Collects
              ? "hasn't collected anything yet!"
              : '';

    return (
      <EmptyState
        message={
          <div>
            <span className="mr-1 font-bold">
              {getProfile(profile).slugWithPrefix}
            </span>
            <span>{emptyMessage}</span>
          </div>
        }
        icon={<RectangleStackIcon className="text-brand-500 h-8 w-8" />}
      />
    );
  }

  if (error) {
    return <ErrorMessage title="Failed to load profile feed" error={error} />;
  }

  return (
    <Card className="divide-y-[1px] dark:divide-gray-700">
      {publications?.map((publication, index) => (
        <SinglePublication
          key={`${publication.id}_${index}`}
          isFirst={index === 0}
          isLast={index === publications.length - 1}
          publication={publication as AnyPublication}
          showThread={
            type !== ProfileFeedType.Media && type !== ProfileFeedType.Collects
          }
        />
      ))}
      {hasMore ? <span ref={observe} /> : null}
    </Card>
  );
};

export default Feed;
