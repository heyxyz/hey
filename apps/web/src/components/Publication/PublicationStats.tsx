import Collectors from '@components/Shared/Modal/Collectors';
import Likes from '@components/Shared/Modal/Likes';
import Mirrors from '@components/Shared/Modal/Mirrors';
import { Modal } from '@components/UI/Modal';
import { CollectionIcon, HeartIcon, SwitchHorizontalIcon } from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import nFormatter from '@lib/nFormatter';
import { t, Trans } from '@lingui/macro';
import type { Publication } from 'lens';
import type { FC } from 'react';
import { useState } from 'react';
import { usePreferencesStore } from 'src/store/preferences';
import { PUBLICATION } from 'src/tracking';

interface Props {
  publication: Publication;
}

const PublicationStats: FC<Props> = ({ publication }) => {
  const hideLikesCount = usePreferencesStore((state) => state.hideLikesCount);
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
            icon={<SwitchHorizontalIcon className="text-brand h-5 w-5" />}
            show={showMirrorsModal}
            onClose={() => setShowMirrorsModal(false)}
          >
            <Mirrors publicationId={publicationId} />
          </Modal>
        </>
      )}
      {!hideLikesCount && reactionCount > 0 && (
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
              Analytics.track(PUBLICATION.STATS.COLLECTED_BY);
            }}
          >
            <Trans>
              <b className="text-black dark:text-white">{nFormatter(collectCount)}</b> Collects
            </Trans>
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
