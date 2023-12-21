import type { FC } from 'react';

import { Bars3BottomLeftIcon } from '@heroicons/react/24/solid';
import { Tooltip } from '@hey/ui';
import { motion } from 'framer-motion';
import { usePublicationStore } from 'src/store/non-persisted/usePublicationStore';

const PollSettings: FC = () => {
  const showPollEditor = usePublicationStore((state) => state.showPollEditor);
  const setShowPollEditor = usePublicationStore(
    (state) => state.setShowPollEditor
  );
  const resetPollConfig = usePublicationStore((state) => state.resetPollConfig);

  return (
    <Tooltip content="Poll" placement="top">
      <motion.button
        aria-label="Poll"
        className="outline-brand-500 rounded-full outline-offset-8"
        onClick={() => {
          resetPollConfig();
          setShowPollEditor(!showPollEditor);
        }}
        type="button"
        whileTap={{ scale: 0.9 }}
      >
        <Bars3BottomLeftIcon className="text-brand-500 size-5" />
      </motion.button>
    </Tooltip>
  );
};

export default PollSettings;
