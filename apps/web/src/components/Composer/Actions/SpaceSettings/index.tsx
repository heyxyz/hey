import { MicrophoneIcon } from '@heroicons/react/outline';
import { FeatureFlag } from '@lenster/data';
import { Tooltip } from '@lenster/ui';
import { Growthbook } from '@lib/growthbook';
import { t } from '@lingui/macro';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { usePublicationStore } from 'src/store/publication';

const SpaceSettings: FC = () => {
  const showSpaceEditor = usePublicationStore((state) => state.showSpaceEditor);
  const setShowSpaceEditor = usePublicationStore(
    (state) => state.setShowSpaceEditor
  );
  const resetSpaceConfig = usePublicationStore(
    (state) => state.resetSpaceConfig
  );
  const { on: isSpacesEnabled } = Growthbook.feature(FeatureFlag.Spaces);

  if (!isSpacesEnabled) {
    return null;
  }

  return (
    <Tooltip placement="top" content={t`Space`}>
      <motion.button
        whileTap={{ scale: 0.9 }}
        type="button"
        onClick={() => {
          resetSpaceConfig();
          setShowSpaceEditor(!showSpaceEditor);
        }}
        aria-label="Space"
      >
        <MicrophoneIcon className="text-brand h-5 w-5" />
      </motion.button>
    </Tooltip>
  );
};

export default SpaceSettings;
