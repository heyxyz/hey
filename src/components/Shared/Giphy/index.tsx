import { Modal } from '@components/UI/Modal';
import { Tooltip } from '@components/UI/Tooltip';
import { IGif } from '@giphy/js-types';
import { GifIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { Mixpanel } from '@lib/mixpanel';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { FC, useState } from 'react';
import { PUBLICATION } from 'src/tracking';

import Loader from '../Loader';

const GifSelector = dynamic(() => import('./GifSelector'), {
  loading: () => <Loader message="Loading GIFs" />
});

interface Props {
  // eslint-disable-next-line no-unused-vars
  setGifAttachment: (gif: IGif) => void;
}

const Giphy: FC<Props> = ({ setGifAttachment }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Tooltip placement="top" content="GIF">
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => {
            setShowModal(!showModal);
            Mixpanel.track(PUBLICATION.NEW.OPEN_GIF);
          }}
          aria-label="Choose GIFs"
        >
          <div className="text-brand">
            <GifIcon className="h-5" />
          </div>
        </motion.button>
      </Tooltip>
      <Modal
        title="Select GIF"
        icon={<PhotoIcon className="w-5 h-5 text-brand" />}
        show={showModal}
        onClose={() => setShowModal(false)}
      >
        <GifSelector setShowModal={setShowModal} setGifAttachment={setGifAttachment} />
      </Modal>
    </>
  );
};

export default Giphy;
