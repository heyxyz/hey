import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
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
import { Card, EmptyState, ErrorMessage } from '@lenster/ui';
import { t } from '@lingui/macro';
import { type FC, useRef } from 'react';
import type { StateSnapshot } from 'react-virtuoso';
import { Virtuoso } from 'react-virtuoso';
import { ProfileFeedType } from 'src/enums';
import { useAppStore } from 'src/store/app';
import { useProfileFeedStore } from 'src/store/profile-feed';

interface FeedProps {
  profile: Profile;
  type:
    | ProfileFeedType.Feed
    | ProfileFeedType.Replies
    | ProfileFeedType.Media
    | ProfileFeedType.Collects;
}

let profileVirtuosoState: any = { ranges: [], screenTop: 0 };

const Feed: FC<FeedProps> = ({ profile, type }) => {
  const profileVirtuosoRef = useRef<any>();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const mediaFeedFilters = useProfileFeedStore(
    (state) => state.mediaFeedFilters
  );

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
    limit: 30
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
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (!hasMore) {
      return;
    }

    await fetchMore({
      variables: {
        request: { ...request, cursor: pageInfo?.next },
        reactionRequest,
        profileId
      }
    });
  };

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
        icon={<RectangleStackIcon className="text-brand h-8 w-8" />}
      />
    );
  }

  if (error) {
    return (
      <ErrorMessage title={t`Failed to load profile feed`} error={error} />
    );
  }

  const onScrolling = (scrolling: boolean) => {
    profileVirtuosoRef?.current?.getState((state: StateSnapshot) => {
      if (!scrolling) {
        profileVirtuosoState = { ...state };
      }
    });
  };

  return (
    <Card
      className="divide-y-[1px] dark:divide-gray-700"
      dataTestId={`profile-feed-type-${type.toLowerCase()}`}
    >
      {publications && (
        <Virtuoso
          restoreStateFrom={
            profileVirtuosoState.ranges.length === 0
              ? profileVirtuosoRef?.current?.getState(
                  (state: StateSnapshot) => state
                )
              : profileVirtuosoState
          }
          ref={profileVirtuosoRef}
          useWindowScroll
          data={publications}
          endReached={onEndReached}
          isScrolling={(scrolling) => onScrolling(scrolling)}
          itemContent={(index, publication) => {
            return (
              <div className="border-b-[1px] dark:border-gray-700">
                <SinglePublication
                  key={`${publication.id}_${index}`}
                  isFirst={index === 0}
                  isLast={index === publications.length - 1}
                  publication={publication as Publication}
                  showThread={
                    type !== ProfileFeedType.Media &&
                    type !== ProfileFeedType.Collects
                  }
                />
              </div>
            );
          }}
        />
      )}
    </Card>
  );
};

export default Feed;
