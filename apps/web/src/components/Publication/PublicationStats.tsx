import Collectors from '@components/Shared/Modal/Collectors';
import Likes from '@components/Shared/Modal/Likes';
import Mirrors from '@components/Shared/Modal/Mirrors';
import {
  CollectionIcon,
  HeartIcon,
  SwitchHorizontalIcon
} from '@heroicons/react/outline';
import type { Publication } from '@lenster/lens';
import nFormatter from '@lenster/lib/nFormatter';
import { Modal } from '@lenster/ui';
import { Leafwatch } from '@lib/leafwatch';
import { Plural, t } from '@lingui/macro';
import type { FC } from 'react';
import { useState } from 'react';
import { PUBLICATION } from 'src/tracking';

interface PublicationStatsProps {
  publication: Publication;
}

const PublicationStats: FC<PublicationStatsProps> = ({ publication }) => {
  const [showMirrorsModal, setShowMirrorsModal] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [showCollectorsModal, setShowCollectorsModal] = useState(false);

  const isMirror = publication.__typename === 'Mirror';
  const commentsCount = isMirror
    ? publication?.mirrorOf?.stats?.totalAmountOfComments
    : publication?.stats?.totalAmountOfComments;
  const mirrorCount = isMirror
    ? publication?.mirrorOf?.stats?.totalAmountOfMirrors
    : publication?.stats?.totalAmountOfMirrors;
  const reactionCount = isMirror
    ? publication?.mirrorOf?.stats?.totalUpvotes
    : publication?.stats?.totalUpvotes;
  const collectCount = isMirror
    ? publication?.mirrorOf?.stats?.totalAmountOfCollects
    : publication?.stats?.totalAmountOfCollects;
  const publicationId = isMirror ? publication?.mirrorOf?.id : publication?.id;

  return (
    <div className="lt-text-gray-500 flex flex-wrap items-center gap-6 py-3 text-sm sm:gap-8">
      {mirrorCount > 0 && (
        <>
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
            icon={<SwitchHorizontalIcon className="text-brand h-5 w-5" />}
            show={showMirrorsModal}
            onClose={() => setShowMirrorsModal(false)}
          >
            <Mirrors publicationId={publicationId} />
          </Modal>
        </>
      )}
      {reactionCount > 0 && (
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
      )}
      {collectCount > 0 && (
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
            icon={<CollectionIcon className="text-brand h-5 w-5" />}
            show={showCollectorsModal}
            onClose={() => setShowCollectorsModal(false)}
          >
            <Collectors publicationId={publicationId} />
          </Modal>
        </>
      )}
    </div>
  );
};

export default PublicationStats;
