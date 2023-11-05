import { SparklesIcon } from '@heroicons/react/24/outline';
import { HOME } from '@hey/data/tracking';
import { Modal, Tooltip } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import type { FC } from 'react';
import { memo, useState } from 'react';

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
      >
        <Tooltip placement="top" content="Algorithms">
          <SparklesIcon className="text-brand-500 h-5 w-5" />
        </Tooltip>
      </button>
      <Modal
        title="Algorithms"
        icon={<SparklesIcon className="text-brand-500 h-5 w-5" />}
        show={showAlgorithmsModal}
        onClose={() => setShowAlgorithmsModal(false)}
      >
        <List />
      </Modal>
    </>
  );
};

export default memo(Algorithms);
