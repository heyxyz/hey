import { Bars3BottomLeftIcon } from '@heroicons/react/24/solid';
import { Tooltip } from '@hey/ui';
import { t } from '@lingui/macro';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { usePublicationStore } from 'src/store/publication';

const PollSettings: FC = () => {
  const showPollEditor = usePublicationStore((state) => state.showPollEditor);
  const setShowPollEditor = usePublicationStore(
    (state) => state.setShowPollEditor
  );
  const resetPollConfig = usePublicationStore((state) => state.resetPollConfig);

  return (
    <Tooltip placement="top" content={t`Poll`}>
      <motion.button
        whileTap={{ scale: 0.9 }}
        type="button"
        onClick={() => {
          resetPollConfig();
          setShowPollEditor(!showPollEditor);
        }}
        aria-label="Poll"
      >
        <Bars3BottomLeftIcon className="text-brand h-5 w-5" />
      </motion.button>
    </Tooltip>
  );
};

export default PollSettings;
