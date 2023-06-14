import { MenuAlt2Icon } from '@heroicons/react/solid';
import { FeatureFlag } from '@lenster/data';
import { Tooltip } from '@lenster/ui';
import { Growthbook } from '@lib/growthbook';
import { t } from '@lingui/macro';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { usePublicationStore } from 'src/store/publication';

const SpaceSettings: FC = () => {
  const showPollEditor = usePublicationStore((state) => state.showPollEditor);
  const setShowPollEditor = usePublicationStore(
    (state) => state.setShowPollEditor
  );
  const resetPollConfig = usePublicationStore((state) => state.resetPollConfig);
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
          resetPollConfig();
          setShowPollEditor(!showPollEditor);
        }}
        aria-label="Space"
      >
        <MenuAlt2Icon className="text-brand h-5 w-5" />
      </motion.button>
    </Tooltip>
  );
};

export default SpaceSettings;
