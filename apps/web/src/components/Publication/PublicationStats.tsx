import Collectors from '@components/Shared/Modal/Collectors';
import Likes from '@components/Shared/Modal/Likes';
import Mirrors from '@components/Shared/Modal/Mirrors';
import { Modal } from '@components/UI/Modal';
import type { LensterPublication } from '@generated/types';
import { CollectionIcon, HeartIcon, SwitchHorizontalIcon } from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import nFormatter from '@lib/nFormatter';
import { t, Trans } from '@lingui/macro';
import type { FC } from 'react';
import { useState } from 'react';
import { PUBLICATION } from 'src/tracking';

interface Props {
  publication: LensterPublication;
}

const PublicationStats: FC<Props> = ({ publication }) => {
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
    <div className="flex flex-wrap gap-6 text-sm items-center py-3 lt-text-gray-500 sm:gap-8">
      {mirrorCount > 0 && (
        <>
          <span>
            <Trans>
              <b className="text-black dark:text-white">{nFormatter(commentsCount)}</b> Comments
            </Trans>
          </span>
          <button
            type="button"
            onClick={() => {
              setShowMirrorsModal(true);
              Analytics.track(PUBLICATION.STATS.MIRRORED_BY);
            }}
          >
            <Trans>
              <b className="text-black dark:text-white">{nFormatter(mirrorCount)}</b> Mirrors
            </Trans>
          </button>
          <Modal
            title={t`Mirrored by`}
            icon={<SwitchHorizontalIcon className="w-5 h-5 text-brand" />}
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
              Analytics.track(PUBLICATION.STATS.LIKED_BY);
            }}
          >
            <Trans>
              <b className="text-black dark:text-white">{nFormatter(reactionCount)}</b> Likes
            </Trans>
          </button>
          <Modal
            title={t`Liked by`}
            icon={<HeartIcon className="w-5 h-5 text-brand" />}
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
              Analytics.track(PUBLICATION.STATS.COLLECTED_BY);
            }}
          >
            <Trans>
              <b className="text-black dark:text-white">{nFormatter(collectCount)}</b> Collects
            </Trans>
          </button>
          <Modal
            title={t`Collected by`}
            icon={<CollectionIcon className="w-5 h-5 text-brand" />}
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
