import type { PublicationStats as IPublicationStats } from '@hey/lens';
import type { FC } from 'react';

import Collectors from '@components/Shared/Modal/Collectors';
import Likes from '@components/Shared/Modal/Likes';
import Mirrors from '@components/Shared/Modal/Mirrors';
import {
  ArrowsRightLeftIcon,
  HeartIcon,
  RectangleStackIcon
} from '@heroicons/react/24/outline';
import { PUBLICATION } from '@hey/data/tracking';
import getPublicationsViews from '@hey/lib/getPublicationsViews';
import nFormatter from '@hey/lib/nFormatter';
import { Modal } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import Link from 'next/link';
import plur from 'plur';
import { memo, useEffect, useState } from 'react';

interface PublicationStatsProps {
  publicationId: string;
  publicationStats: IPublicationStats;
}

const PublicationStats: FC<PublicationStatsProps> = ({
  publicationId,
  publicationStats
}) => {
  const [views, setViews] = useState<number>(0);
  const [showMirrorsModal, setShowMirrorsModal] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [showCollectorsModal, setShowCollectorsModal] = useState(false);

  useEffect(() => {
    // Get Views
    getPublicationsViews([publicationId]).then((viewsResponse) => {
      setViews(viewsResponse?.[0]?.views);
    });
  }, [publicationId]);

  const { bookmarks, comments, countOpenActions, mirrors, quotes, reactions } =
    publicationStats;
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
      <div className="ld-text-gray-500 flex flex-wrap items-center gap-x-6 gap-y-3 py-3 text-sm">
        {comments > 0 ? (
          <span>
            <b className="text-black dark:text-white">{nFormatter(comments)}</b>{' '}
            {plur('Comment', comments)}
          </span>
        ) : null}
        {shares > 0 ? (
          <>
            <button
              className="outline-offset-2"
              onClick={() => {
                setShowMirrorsModal(true);
                Leafwatch.track(PUBLICATION.OPEN_MIRRORS, {
                  publication_id: publicationId
                });
              }}
              type="button"
            >
              <b className="text-black dark:text-white">{nFormatter(shares)}</b>{' '}
              {plur('Mirror', shares)}
            </button>
            <Modal
              icon={<ArrowsRightLeftIcon className="size-5" />}
              onClose={() => setShowMirrorsModal(false)}
              show={showMirrorsModal}
              title="Mirrored by"
            >
              <Mirrors publicationId={publicationId} />
            </Modal>
          </>
        ) : null}
        {quotes > 0 ? (
          <Link
            className="outline-offset-2"
            href={`/posts/${publicationId}/quotes`}
          >
            <b className="text-black dark:text-white">{nFormatter(quotes)}</b>{' '}
            {plur('Quote', quotes)}
          </Link>
        ) : null}
        {reactions > 0 ? (
          <>
            <button
              className="outline-offset-2"
              onClick={() => {
                setShowLikesModal(true);
                Leafwatch.track(PUBLICATION.OPEN_LIKES, {
                  publication_id: publicationId
                });
              }}
              type="button"
            >
              <b className="text-black dark:text-white">
                {nFormatter(reactions)}
              </b>{' '}
              {plur('Like', reactions)}
            </button>
            <Modal
              icon={<HeartIcon className="size-5" />}
              onClose={() => setShowLikesModal(false)}
              show={showLikesModal}
              title="Liked by"
            >
              <Likes publicationId={publicationId} />
            </Modal>
          </>
        ) : null}
        {countOpenActions > 0 ? (
          <>
            <button
              className="outline-offset-2"
              onClick={() => {
                setShowCollectorsModal(true);
                Leafwatch.track(PUBLICATION.OPEN_COLLECTORS, {
                  publication_id: publicationId
                });
              }}
              type="button"
            >
              <b className="text-black dark:text-white">
                {nFormatter(countOpenActions)}
              </b>{' '}
              {plur('Collect', countOpenActions)}
            </button>
            <Modal
              icon={<RectangleStackIcon className="size-5" />}
              onClose={() => setShowCollectorsModal(false)}
              show={showCollectorsModal}
              title="Collected by"
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
