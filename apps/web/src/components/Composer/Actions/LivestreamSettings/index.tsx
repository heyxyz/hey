import type { FC } from 'react';

import { VideoCameraIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@hey/ui';
import { motion } from 'framer-motion';
import { usePublicationStore } from 'src/store/non-persisted/usePublicationStore';

const LivestreamSettings: FC = () => {
  const showLiveVideoEditor = usePublicationStore(
    (state) => state.showLiveVideoEditor
  );
  const setShowLiveVideoEditor = usePublicationStore(
    (state) => state.setShowLiveVideoEditor
  );
  const resetLiveVideoConfig = usePublicationStore(
    (state) => state.resetLiveVideoConfig
  );

  return (
    <Tooltip content="Go Live" placement="top">
      <motion.button
        aria-label="Go Live"
        onClick={() => {
          resetLiveVideoConfig();
          setShowLiveVideoEditor(!showLiveVideoEditor);
        }}
        type="button"
        whileTap={{ scale: 0.9 }}
      >
        <VideoCameraIcon className="text-brand-500 size-5" />
      </motion.button>
    </Tooltip>
  );
};

export default LivestreamSettings;
