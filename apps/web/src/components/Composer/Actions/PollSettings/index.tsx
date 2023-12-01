import { Bars3BottomLeftIcon } from '@heroicons/react/24/solid';
import { Tooltip } from '@hey/ui';
import { motion } from 'framer-motion';
import { type FC } from 'react';

import { usePublicationStore } from '@/store/non-persisted/usePublicationStore';

const PollSettings: FC = () => {
  const showPollEditor = usePublicationStore((state) => state.showPollEditor);
  const setShowPollEditor = usePublicationStore(
    (state) => state.setShowPollEditor
  );
  const resetPollConfig = usePublicationStore((state) => state.resetPollConfig);

  return (
    <Tooltip placement="top" content="Poll">
      <motion.button
        className="outline-brand-500 rounded-full outline-offset-8"
        whileTap={{ scale: 0.9 }}
        type="button"
        onClick={() => {
          resetPollConfig();
          setShowPollEditor(!showPollEditor);
        }}
        aria-label="Poll"
      >
        <Bars3BottomLeftIcon className="text-brand-500 h-5 w-5" />
      </motion.button>
    </Tooltip>
  );
};

export default PollSettings;
