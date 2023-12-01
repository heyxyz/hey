import { GifIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { PUBLICATION } from '@hey/data/tracking';
import type { IGif } from '@hey/types/giphy';
import { Modal, Tooltip } from '@hey/ui';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { lazy, Suspense, useState } from 'react';

import Loader from '@/components/Shared/Loader';
import { Leafwatch } from '@/lib/leafwatch';
import { usePublicationStore } from '@/store/non-persisted/usePublicationStore';

const GifSelector = lazy(() => import('./GifSelector'));

interface GiphyProps {
  setGifAttachment: (gif: IGif) => void;
}

const Gif: FC<GiphyProps> = ({ setGifAttachment }) => {
  const attachments = usePublicationStore((state) => state.attachments);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Tooltip placement="top" content="GIF">
        <motion.button
          className="outline-brand-500 rounded-full outline-offset-8"
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => {
            setShowModal(!showModal);
            Leafwatch.track(PUBLICATION.OPEN_GIFS);
          }}
          disabled={attachments.length >= 4}
          aria-label="Choose GIFs"
        >
          <GifIcon className="text-brand-500 h-5 w-5" />
        </motion.button>
      </Tooltip>
      <Modal
        title="Select GIF"
        icon={<PhotoIcon className="text-brand-500 h-5 w-5" />}
        show={showModal}
        onClose={() => setShowModal(false)}
      >
        <Suspense fallback={<Loader message="Loading GIFs" />}>
          <GifSelector
            setShowModal={setShowModal}
            setGifAttachment={setGifAttachment}
          />
        </Suspense>
      </Modal>
    </>
  );
};

export default Gif;
