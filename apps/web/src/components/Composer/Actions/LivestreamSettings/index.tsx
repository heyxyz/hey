import { VideoCameraIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@hey/ui';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { usePublicationStore } from 'src/store/usePublicationStore';

const LivestreamSettings: FC = () => {
  const { showLiveVideoEditor, setShowLiveVideoEditor, resetLiveVideoConfig } =
    usePublicationStore();

  return (
    <Tooltip placement="top" content="Go Live">
      <motion.button
        whileTap={{ scale: 0.9 }}
        type="button"
        onClick={() => {
          resetLiveVideoConfig();
          setShowLiveVideoEditor(!showLiveVideoEditor);
        }}
        aria-label="Go Live"
      >
        <VideoCameraIcon className="text-brand h-5 w-5" />
      </motion.button>
    </Tooltip>
  );
};

export default LivestreamSettings;
