import { useFeature } from '@growthbook/growthbook-react';
import { MenuAlt2Icon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import { FeatureFlag } from 'data';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { useState } from 'react';
import { Tooltip } from 'ui';

const PollSettings: FC = () => {
  const [showPollEditor, setShowPollEditor] = useState(false);
  const { on: isPollsEnabled } = useFeature(FeatureFlag.Polls as string);

  if (!isPollsEnabled) {
    return null;
  }

  return (
    <Tooltip placement="top" content={t`Poll`}>
      <motion.button
        whileTap={{ scale: 0.9 }}
        type="button"
        onClick={() => setShowPollEditor(!showPollEditor)}
        aria-label="Poll"
      >
        <MenuAlt2Icon className="text-brand h-5 w-5" />
      </motion.button>
    </Tooltip>
  );
};

export default PollSettings;
