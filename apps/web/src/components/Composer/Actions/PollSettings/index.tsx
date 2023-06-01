import { MenuAlt2Icon } from '@heroicons/react/solid';
import { FeatureFlag } from '@lenster/data';
import { Tooltip } from '@lenster/ui';
import { Growthbook } from '@lib/growthbook';
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
  const { on: isPollsEnabled } = Growthbook.feature(FeatureFlag.Polls);

  if (!isPollsEnabled) {
    return null;
  }

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
        <MenuAlt2Icon className="text-brand h-5 w-5" />
      </motion.button>
    </Tooltip>
  );
};

export default PollSettings;
