import {
  ArrowsRightLeftIcon,
  HeartIcon,
  RectangleStackIcon
} from '@heroicons/react/24/outline';
import { PUBLICATION } from '@hey/data/tracking';
import type { AnyPublication } from '@hey/lens';
import getPublicationsViews from '@hey/lib/getPublicationsViews';
import nFormatter from '@hey/lib/nFormatter';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import { Modal } from '@hey/ui';
import plur from 'plur';
import type { FC } from 'react';
import { memo, useEffect, useState } from 'react';

import Collectors from '@/components/Shared/Modal/Collectors';
import Likes from '@/components/Shared/Modal/Likes';
import Mirrors from '@/components/Shared/Modal/Mirrors';
import Quotes from '@/components/Shared/Modal/Quotes';
import { Leafwatch } from '@/lib/leafwatch';

interface PublicationStatsProps {
  publication: AnyPublication;
}

const PublicationStats: FC<PublicationStatsProps> = ({ publication }) => {
  const [views, setViews] = useState<number>(0);
  const [showMirrorsModal, setShowMirrorsModal] = useState(false);
  const [showQuotesModal, setShowQuotesModal] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [showCollectorsModal, setShowCollectorsModal] = useState(false);

  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;

  useEffect(() => {
    // Get Views
    getPublicationsViews([targetPublication.id]).then((viewsResponse) => {
      setViews(viewsResponse?.[0]?.views);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetPublication]);

  const publicationId = targetPublication.id;
  const { comments, reactions, mirrors, quotes, countOpenActions, bookmarks } =
    targetPublication.stats;
  const shares = mirrors + quotes;

  const showStats =
    comments > 0 ||
    reactions > 0 ||
    shares > 0 ||
    quotes > 0 ||
    countOpenActions > 0 ||
    bookmarks > 0 ||
    views > 0;

  if (!showStats) {
    return null;
  }

  return (
    <>
      <div className="divider" />
      <div className="ld-text-gray-500 flex flex-wrap items-center gap-6 py-3 text-sm sm:gap-8">
        {comments > 0 ? (
          <span>
            <b className="text-black dark:text-white">{nFormatter(comments)}</b>{' '}
            {plur('Comment', comments)}
          </span>
        ) : null}
        {shares > 0 ? (
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
              <b className="text-black dark:text-white">{nFormatter(shares)}</b>{' '}
              {plur('Mirror', shares)}
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
        {quotes > 0 ? (
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
              <b className="text-black dark:text-white">{nFormatter(quotes)}</b>{' '}
              {plur('Quote', quotes)}
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
        {reactions > 0 ? (
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
                {nFormatter(reactions)}
              </b>{' '}
              {plur('Like', reactions)}
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
        {countOpenActions > 0 ? (
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
                {nFormatter(countOpenActions)}
              </b>{' '}
              {plur('Collect', countOpenActions)}
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
        {bookmarks > 0 ? (
          <span>
            <b className="text-black dark:text-white">
              {nFormatter(bookmarks)}
            </b>{' '}
            {plur('Bookmark', bookmarks)}
          </span>
        ) : null}
        {views > 0 ? (
          <span>
            <b className="text-black dark:text-white">{nFormatter(views)}</b>{' '}
            {plur('View', views)}
          </span>
        ) : null}
      </div>
    </>
  );
};

export default memo(PublicationStats);
