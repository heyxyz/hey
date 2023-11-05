import Collectors from '@components/Shared/Modal/Collectors';
import Likes from '@components/Shared/Modal/Likes';
import Mirrors from '@components/Shared/Modal/Mirrors';
import Quotes from '@components/Shared/Modal/Quotes';
import {
  ArrowsRightLeftIcon,
  HeartIcon,
  RectangleStackIcon
} from '@heroicons/react/24/outline';
import { PUBLICATION } from '@hey/data/tracking';
import type { AnyPublication } from '@hey/lens';
import nFormatter from '@hey/lib/nFormatter';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import { Modal } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import plur from 'plur';
import type { FC } from 'react';
import { memo, useEffect, useState } from 'react';
import { useBookmarkOptimisticStore } from 'src/store/OptimisticActions/useBookmarkOptimisticStore';
import { useMirrorOrQuoteOptimisticStore } from 'src/store/OptimisticActions/useMirrorOrQuoteOptimisticStore';
import { useOpenActionOptimisticStore } from 'src/store/OptimisticActions/useOpenActionOptimisticStore';
import { useReactionOptimisticStore } from 'src/store/OptimisticActions/useReactionOptimisticStore';

interface PublicationStatsProps {
  publication: AnyPublication;
}

const PublicationStats: FC<PublicationStatsProps> = ({ publication }) => {
  const getReactionCountByPublicationId = useReactionOptimisticStore(
    (state) => state.getReactionCountByPublicationId
  );
  const setReactionConfig = useReactionOptimisticStore(
    (state) => state.setReactionConfig
  );
  const getMirrorOrQuoteCountByPublicationId = useMirrorOrQuoteOptimisticStore(
    (state) => state.getMirrorOrQuoteCountByPublicationId
  );
  const setMirrorOrQuoteConfig = useMirrorOrQuoteOptimisticStore(
    (state) => state.setMirrorOrQuoteConfig
  );
  const getOpenActionCountByPublicationId = useOpenActionOptimisticStore(
    (state) => state.getOpenActionCountByPublicationId
  );
  const setOpenActionPublicationConfig = useOpenActionOptimisticStore(
    (state) => state.setOpenActionPublicationConfig
  );
  const getBookmarkCountByPublicationId = useBookmarkOptimisticStore(
    (state) => state.getBookmarkCountByPublicationId
  );
  const setBookmarkConfig = useBookmarkOptimisticStore(
    (state) => state.setBookmarkConfig
  );

  const [showMirrorsModal, setShowMirrorsModal] = useState(false);
  const [showQuotesModal, setShowQuotesModal] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [showCollectorsModal, setShowCollectorsModal] = useState(false);

  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;

  useEffect(() => {
    setReactionConfig(targetPublication.id, {
      countReaction: targetPublication.stats.reactions,
      reacted: targetPublication.operations.hasReacted
    });
    setMirrorOrQuoteConfig(targetPublication.id, {
      // We done substracting quotes because quotes are counted separately
      countMirrorOrQuote:
        targetPublication.stats.mirrors - targetPublication.stats.quotes,
      mirroredOrQuoted:
        targetPublication.operations.hasMirrored ||
        targetPublication.operations.hasQuoted
    });
    setOpenActionPublicationConfig(targetPublication.id, {
      countOpenActions: targetPublication.stats.countOpenActions,
      acted: targetPublication.operations.hasActed.value
    });
    setBookmarkConfig(targetPublication.id, {
      countBookmarks: targetPublication.stats.bookmarks,
      bookmarked: targetPublication.operations.hasBookmarked
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetPublication]);

  const reactionsCount = getReactionCountByPublicationId(targetPublication.id);
  const mirrorOrQuoteCount = getMirrorOrQuoteCountByPublicationId(
    targetPublication.id
  );
  const openActionsCount = getOpenActionCountByPublicationId(
    targetPublication.id
  );
  const bookmarksCount = getBookmarkCountByPublicationId(targetPublication.id);
  const quotesCount = targetPublication.stats.quotes;
  const commentsCount = targetPublication.stats.comments;
  const publicationId = targetPublication.id;

  const showStats =
    mirrorOrQuoteCount > 0 ||
    quotesCount > 0 ||
    commentsCount > 0 ||
    reactionsCount > 0 ||
    openActionsCount > 0 ||
    bookmarksCount > 0;

  if (!showStats) {
    return null;
  }

  return (
    <>
      <div className="divider" />
      <div className="ld-text-gray-500 flex flex-wrap items-center gap-6 py-3 text-sm sm:gap-8">
        {commentsCount > 0 ? (
          <span>
            <b className="text-black dark:text-white">
              {nFormatter(commentsCount)}
            </b>{' '}
            {plur('Comment', commentsCount)}
          </span>
        ) : null}
        {mirrorOrQuoteCount > 0 ? (
          <>
            <button
              type="button"
              className="outline-brand-500 outline-offset-2"
              onClick={() => {
                setShowMirrorsModal(true);
                Leafwatch.track(PUBLICATION.OPEN_MIRRORS, {
                  publication_id: publicationId
                });
              }}
            >
              <b className="text-black dark:text-white">
                {nFormatter(mirrorOrQuoteCount)}
              </b>{' '}
              {plur('Mirror', commentsCount)}
            </button>
            <Modal
              title="Mirrored by"
              icon={<ArrowsRightLeftIcon className="text-brand-500 h-5 w-5" />}
              show={showMirrorsModal}
              onClose={() => setShowMirrorsModal(false)}
            >
              <Mirrors publicationId={publicationId} />
            </Modal>
          </>
        ) : null}
        {quotesCount > 0 ? (
          <>
            <button
              type="button"
              className="outline-brand-500 outline-offset-2"
              onClick={() => {
                setShowQuotesModal(true);
                Leafwatch.track(PUBLICATION.OPEN_QUOTES, {
                  publication_id: publicationId
                });
              }}
            >
              <b className="text-black dark:text-white">
                {nFormatter(quotesCount)}
              </b>{' '}
              {plur('Quote', quotesCount)}
            </button>
            <Modal
              title="Quoted by"
              icon={<ArrowsRightLeftIcon className="text-brand-500 h-5 w-5" />}
              show={showQuotesModal}
              onClose={() => setShowQuotesModal(false)}
            >
              <Quotes publicationId={publicationId} />
            </Modal>
          </>
        ) : null}
        {reactionsCount > 0 ? (
          <>
            <button
              type="button"
              className="outline-brand-500 outline-offset-2"
              onClick={() => {
                setShowLikesModal(true);
                Leafwatch.track(PUBLICATION.OPEN_LIKES, {
                  publication_id: publicationId
                });
              }}
            >
              <b className="text-black dark:text-white">
                {nFormatter(reactionsCount)}
              </b>{' '}
              {plur('Like', reactionsCount)}
            </button>
            <Modal
              title="Liked by"
              icon={<HeartIcon className="text-brand-500 h-5 w-5" />}
              show={showLikesModal}
              onClose={() => setShowLikesModal(false)}
            >
              <Likes publicationId={publicationId} />
            </Modal>
          </>
        ) : null}
        {openActionsCount > 0 ? (
          <>
            <button
              type="button"
              className="outline-brand-500 outline-offset-2"
              onClick={() => {
                setShowCollectorsModal(true);
                Leafwatch.track(PUBLICATION.OPEN_COLLECTORS, {
                  publication_id: publicationId
                });
              }}
            >
              <b className="text-black dark:text-white">
                {nFormatter(openActionsCount)}
              </b>{' '}
              {plur('Collect', openActionsCount)}
            </button>
            <Modal
              title="Collected by"
              icon={<RectangleStackIcon className="text-brand-500 h-5 w-5" />}
              show={showCollectorsModal}
              onClose={() => setShowCollectorsModal(false)}
            >
              <Collectors publicationId={publicationId} />
            </Modal>
          </>
        ) : null}
        {bookmarksCount > 0 ? (
          <span>
            <b className="text-black dark:text-white">
              {nFormatter(bookmarksCount)}
            </b>{' '}
            {plur('Bookmark', bookmarksCount)}
          </span>
        ) : null}
      </div>
    </>
  );
};

export default memo(PublicationStats);
