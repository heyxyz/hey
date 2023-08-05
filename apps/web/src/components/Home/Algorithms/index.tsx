import { SparklesIcon } from '@heroicons/react/outline';
import { Modal, Tooltip } from '@lenster/ui';
import { t } from '@lingui/macro';
import { type FC, useState } from 'react';

import List from './List';

const Algorithms: FC = () => {
  const [showAlgorithmsModal, setShowAlgorithmsModal] = useState(false);

  return (
    <>
      <button
        className="rounded-md p-1 hover:bg-gray-300/20"
        onClick={() => {
          setShowAlgorithmsModal(true);
          // Leafwatch.track(MISCELLANEOUS.SWITCH_HIGHLIGHTS_FEED);
        }}
      >
        <Tooltip placement="top" content={t`Algorithms`}>
          <SparklesIcon className="text-brand h-5 w-5" />
        </Tooltip>
      </button>
      <Modal
        title={t`Algorithms`}
        icon={<SparklesIcon className="text-brand h-5 w-5" />}
        show={showAlgorithmsModal}
        onClose={() => setShowAlgorithmsModal(false)}
      >
        <List />
      </Modal>
    </>
  );
};

export default Algorithms;
