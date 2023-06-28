import type { QuadraticRound } from '@components/Composer/NewPublication';
import { LightBulbIcon } from '@heroicons/react/outline';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { Tooltip } from 'ui';

interface Props {
  selectedQuadraticRound: QuadraticRound;
}

const RequirementsNotification: FC<Props> = ({ selectedQuadraticRound }) => {
  return (
    <Tooltip
      placement="top"
      content={`This round requires the post to contain ${selectedQuadraticRound.requirements} in order to join round.`}
    >
      <motion.button whileTap={{ scale: 0.9 }} type="button">
        <div className="text-brand h-4 w-4">
          <LightBulbIcon color="#8B5CF6" />
        </div>
      </motion.button>
    </Tooltip>
  );
};

export default RequirementsNotification;
