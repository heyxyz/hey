import Loader from '@components/Shared/Loader';
import { GifIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { PUBLICATION } from '@hey/data/tracking';
import type { IGif } from '@hey/types/giphy';
import { Modal, Tooltip } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { t } from '@lingui/macro';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import type { FC } from 'react';
import { useState } from 'react';
import { usePublicationStore } from 'src/store/publication';

const GifSelector = dynamic(() => import('./GifSelector'), {
  loading: () => <Loader message={t`Loading GIFs`} />
});

interface GiphyProps {
  setGifAttachment: (gif: IGif) => void;
}

const Gif: FC<GiphyProps> = ({ setGifAttachment }) => {
  const attachments = usePublicationStore((state) => state.attachments);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Tooltip placement="top" content={t`GIF`}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => {
            setShowModal(!showModal);
            Leafwatch.track(PUBLICATION.OPEN_GIFS);
          }}
          disabled={attachments.length >= 4}
          aria-label="Choose GIFs"
        >
          <GifIcon className="text-brand h-5 w-5" />
        </motion.button>
      </Tooltip>
      <Modal
        title={t`Select GIF`}
        icon={<PhotoIcon className="text-brand h-5 w-5" />}
        show={showModal}
        onClose={() => setShowModal(false)}
      >
        <GifSelector
          setShowModal={setShowModal}
          setGifAttachment={setGifAttachment}
        />
      </Modal>
    </>
  );
};

export default Gif;
