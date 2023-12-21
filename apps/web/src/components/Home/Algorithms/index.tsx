import type { FC } from 'react';

import { SparklesIcon } from '@heroicons/react/24/outline';
import { HOME } from '@hey/data/tracking';
import { Modal, Tooltip } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { useState } from 'react';

import List from './List';

const Algorithms: FC = () => {
  const [showAlgorithmsModal, setShowAlgorithmsModal] = useState(false);

  return (
    <>
      <button
        className="outline-brand-500 rounded-md p-1 hover:bg-gray-300/20"
        onClick={() => {
          setShowAlgorithmsModal(true);
          Leafwatch.track(HOME.ALGORITHMS.OPEN_ALGORITHMS);
        }}
        type="button"
      >
        <Tooltip content="Algorithms" placement="top">
          <SparklesIcon className="text-brand-500 size-5" />
        </Tooltip>
      </button>
      <Modal
        icon={<SparklesIcon className="text-brand-500 size-5" />}
        onClose={() => setShowAlgorithmsModal(false)}
        show={showAlgorithmsModal}
        title="Algorithms"
      >
        <List />
      </Modal>
    </>
  );
};

export default Algorithms;
