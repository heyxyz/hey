import Collectors from '@components/Shared/Modal/Collectors';
import Likes from '@components/Shared/Modal/Likes';
import Mirrors from '@components/Shared/Modal/Mirrors';
import {
  ArrowsRightLeftIcon,
  HeartIcon,
  RectangleStackIcon
} from '@heroicons/react/24/outline';
import { PUBLICATION } from '@lenster/data/tracking';
import type { AnyPublication } from '@lenster/lens';
import nFormatter from '@lenster/lib/nFormatter';
import { Modal } from '@lenster/ui';
import { Leafwatch } from '@lib/leafwatch';
import { Plural, t } from '@lingui/macro';
import type { FC } from 'react';
import { useState } from 'react';

interface PublicationStatsProps {
  publication: AnyPublication;
}

const PublicationStats: FC<PublicationStatsProps> = ({ publication }) => {
  const [showMirrorsModal, setShowMirrorsModal] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [showCollectorsModal, setShowCollectorsModal] = useState(false);

  const isMirror = publication.__typename === 'Mirror';
  const commentsCount = isMirror
    ? publication?.mirrorOn?.stats?.comments
    : publication?.stats?.totalAmountOfComments;
  const mirrorCount = isMirror
    ? publication?.mirrorOn?.stats?.mirrors
    : publication?.stats?.totalAmountOfMirrors;
  const reactionCount = isMirror
    ? publication?.mirrorOn?.stats?.reactions
    : publication?.stats?.totalUpvotes;
  const collectCount = isMirror
    ? publication?.mirrorOn?.stats?.countOpenActions
    : publication?.stats?.totalAmountOfCollects;
  const bookmarkCount = isMirror
    ? publication?.mirrorOn?.stats?.totalBookmbarks
    : publication?.stats?.totalBookmarks;
  const publicationId = isMirror ? publication?.mirrorOn?.id : publication?.id;

  return (
    <div className="lt-text-gray-500 flex flex-wrap items-center gap-6 py-3 text-sm sm:gap-8">
      {commentsCount > 0 ? (
        <span data-testid="comment-stats">
          <b className="text-black dark:text-white">
            {nFormatter(commentsCount)}
          </b>{' '}
          <Plural
            value={commentsCount}
            zero="Comment"
            one="Comment"
            other="Comments"
          />
        </span>
      ) : null}
      {mirrorCount > 0 ? (
        <>
          <button
            type="button"
            onClick={() => {
              setShowMirrorsModal(true);
              Leafwatch.track(PUBLICATION.OPEN_MIRRORS, {
                publication_id: publicationId
              });
            }}
            data-testid="mirror-stats"
          >
            <b className="text-black dark:text-white">
              {nFormatter(mirrorCount)}
            </b>{' '}
            <Plural
              value={mirrorCount}
              zero="Mirror"
              one="Mirror"
              other="Mirrors"
            />
          </button>
          <Modal
            title={t`Mirrored by`}
            icon={<ArrowsRightLeftIcon className="text-brand h-5 w-5" />}
            show={showMirrorsModal}
            onClose={() => setShowMirrorsModal(false)}
          >
            <Mirrors publicationId={publicationId} />
          </Modal>
        </>
      ) : null}
      {reactionCount > 0 ? (
        <>
          <button
            type="button"
            onClick={() => {
              setShowLikesModal(true);
              Leafwatch.track(PUBLICATION.OPEN_LIKES, {
                publication_id: publicationId
              });
            }}
            data-testid="like-stats"
          >
            <b className="text-black dark:text-white">
              {nFormatter(reactionCount)}
            </b>{' '}
            <Plural
              value={reactionCount}
              zero="Like"
              one="Like"
              other="Likes"
            />
          </button>
          <Modal
            title={t`Liked by`}
            icon={<HeartIcon className="text-brand h-5 w-5" />}
            show={showLikesModal}
            onClose={() => setShowLikesModal(false)}
          >
            <Likes publicationId={publicationId} />
          </Modal>
        </>
      ) : null}
      {collectCount > 0 ? (
        <>
          <button
            type="button"
            onClick={() => {
              setShowCollectorsModal(true);
              Leafwatch.track(PUBLICATION.OPEN_COLLECTORS, {
                publication_id: publicationId
              });
            }}
            data-testid="collect-stats"
          >
            <b className="text-black dark:text-white">
              {nFormatter(collectCount)}
            </b>{' '}
            <Plural
              value={collectCount}
              zero="Collect"
              one="Collect"
              other="Collects"
            />
          </button>
          <Modal
            title={t`Collected by`}
            icon={<RectangleStackIcon className="text-brand h-5 w-5" />}
            show={showCollectorsModal}
            onClose={() => setShowCollectorsModal(false)}
          >
            <Collectors publicationId={publicationId} />
          </Modal>
        </>
      ) : null}
      {bookmarkCount > 0 ? (
        <span data-testid="bookmark-stats">
          <b className="text-black dark:text-white">
            {nFormatter(bookmarkCount)}
          </b>{' '}
          <Plural
            value={bookmarkCount}
            zero="Bookmark"
            one="Bookmark"
            other="Bookmarks"
          />
        </span>
      ) : null}
    </div>
  );
};

export default PublicationStats;
