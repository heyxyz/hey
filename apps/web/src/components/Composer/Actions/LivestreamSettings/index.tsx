import type { FC } from 'react';

import { VideoCameraIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@hey/ui';
import { motion } from 'framer-motion';
import { usePublicationLiveStore } from 'src/store/non-persisted/publication/usePublicationLiveStore';

const LivestreamSettings: FC = () => {
  const { resetLiveVideoConfig, setShowLiveVideoEditor, showLiveVideoEditor } =
    usePublicationLiveStore();

  return (
    <Tooltip content="Go Live" placement="top">
      <motion.button
        aria-label="Go Live"
        className="rounded-full outline-offset-8"
        onClick={() => {
          resetLiveVideoConfig();
          setShowLiveVideoEditor(!showLiveVideoEditor);
        }}
        type="button"
        whileTap={{ scale: 0.9 }}
      >
        <VideoCameraIcon className="size-5" />
      </motion.button>
    </Tooltip>
  );
};

export default LivestreamSettings;
