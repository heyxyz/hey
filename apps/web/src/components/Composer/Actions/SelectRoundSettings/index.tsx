import TipsOutlineIcon from '@components/Shared/TipIcons/TipsOutlineIcon';
import { t } from '@lingui/macro';
import { motion } from 'framer-motion';
import type { Dispatch, FC, SetStateAction } from 'react';
import { useState } from 'react';
import { useCollectModuleStore } from 'src/store/collect-module';
import { Modal, Tooltip } from 'ui';

import SelectQuadraticRoundMenu from './SelectQuadraticRoundMenu';

interface Props {
  selectedQuadraticRound: string;
  setSelectedQuadraticRound: Dispatch<SetStateAction<string>>;
}

const SelectRoundSettings: FC<Props> = ({ setSelectedQuadraticRound }) => {
  const reset = useCollectModuleStore((state) => state.reset);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Tooltip placement="top" content={'Select a quadratic funding round!'}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => setShowModal(!showModal)}
          aria-label="Choose Quadratic Funding Round"
        >
          <div className="text-brand">
            <TipsOutlineIcon color="#8B5CF6" />
          </div>
        </motion.button>
      </Tooltip>
      <Modal
        title={t`Select Quadratic Funding Round`}
        icon={<TipsOutlineIcon color="#8B5CF6" />}
        show={showModal}
        onClose={() => {
          setShowModal(false);
          reset();
        }}
      >
        <div className="m-4">
          <SelectQuadraticRoundMenu
            setSelectedQuadraticRound={setSelectedQuadraticRound}
            setShowModal={setShowModal}
          />
        </div>
      </Modal>
    </>
  );
};

export default SelectRoundSettings;
