import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { CollectionIcon } from '@heroicons/react/outline';
import type {
  Profile,
  Publication,
  PublicationsQueryRequest
} from '@lenster/lens';
import {
  PublicationMainFocus,
  PublicationTypes,
  useProfileFeedQuery
} from '@lenster/lens';
import formatHandle from '@lenster/lib/formatHandle';
import { t } from '@lingui/macro';
import type { FC } from 'react';
import { useState } from 'react';
import { useInView } from 'react-cool-inview';
import { ProfileFeedType } from 'src/enums';
import { useAppStore } from 'src/store/app';
import { useProfileFeedStore } from 'src/store/profile-feed';
import { Card, EmptyState, ErrorMessage } from 'ui';

interface FeedProps {
  profile: Profile;
  type:
    | ProfileFeedType.Feed
    | ProfileFeedType.Replies
    | ProfileFeedType.Media
    | ProfileFeedType.Collects;
}

const Feed: FC<FeedProps> = ({ profile, type }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const mediaFeedFilters = useProfileFeedStore(
    (state) => state.mediaFeedFilters
  );
  const [hasMore, setHasMore] = useState(true);

  const getMediaFilters = () => {
    let filters: PublicationMainFocus[] = [];
    if (mediaFeedFilters.images) {
      filters.push(PublicationMainFocus.Image);
    }
    if (mediaFeedFilters.video) {
      filters.push(PublicationMainFocus.Video);
    }
    if (mediaFeedFilters.audio) {
      filters.push(PublicationMainFocus.Audio);
    }
    return filters;
  };

  // Variables
  const publicationTypes =
    type === ProfileFeedType.Feed
      ? [PublicationTypes.Post, PublicationTypes.Mirror]
      : type === ProfileFeedType.Replies
      ? [PublicationTypes.Comment]
      : type === ProfileFeedType.Media
      ? [PublicationTypes.Post, PublicationTypes.Comment]
      : [
          PublicationTypes.Post,
          PublicationTypes.Comment,
          PublicationTypes.Mirror
        ];
  const metadata =
    type === ProfileFeedType.Media
      ? {
          mainContentFocus: getMediaFilters()
        }
      : null;
  const request: PublicationsQueryRequest = {
    publicationTypes,
    metadata,
    ...(type !== ProfileFeedType.Collects
      ? { profileId: profile?.id }
      : { collectedBy: profile?.ownedBy }),
    limit: 10
  };
  const reactionRequest = currentProfile
    ? { profileId: currentProfile?.id }
    : null;
  const profileId = currentProfile?.id ?? null;

  const { data, loading, error, fetchMore } = useProfileFeedQuery({
    variables: { request, reactionRequest, profileId },
    skip: !profile?.id
  });

  const publications = data?.publications?.items;
  const pageInfo = data?.publications?.pageInfo;

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView || !hasMore) {
        return;
      }

      await fetchMore({
        variables: {
          request: { ...request, cursor: pageInfo?.next },
          reactionRequest,
          profileId
        }
      }).then(({ data }) => {
        setHasMore(data?.publications?.items?.length > 0);
      });
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
              @{formatHandle(profile?.handle)}
            </span>
            <span>{emptyMessage}</span>
          </div>
        }
        icon={<CollectionIcon className="text-brand h-8 w-8" />}
      />
    );
  }

  if (error) {
    return (
      <ErrorMessage title={t`Failed to load profile feed`} error={error} />
    );
  }

  return (
    <Card
      className="divide-y-[1px] dark:divide-gray-700"
      dataTestId={`profile-feed-type-${type.toLowerCase()}`}
    >
      {publications?.map((publication, index) => (
        <SinglePublication
          key={`${publication.id}_${index}`}
          publication={publication as Publication}
          showThread={
            type !== ProfileFeedType.Media && type !== ProfileFeedType.Collects
          }
        />
      ))}
      {hasMore && <span ref={observe} />}
    </Card>
  );
};

export default Feed;
