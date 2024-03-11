import type { FC } from 'react';

import { SquaresPlusIcon } from '@heroicons/react/24/outline';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { Modal, Tooltip } from '@hey/ui';
import { motion } from 'framer-motion';
import {
  ScreenType,
  useOpenActionStore
} from 'src/store/non-persisted/publication/useOpenActionStore';

import OpenActionsList from './OpenActionsList';

const OpenActionSettings: FC = () => {
  const {
    reset,
    screen,
    selectedOpenAction,
    setScreen,
    setShowModal,
    showModal
  } = useOpenActionStore();

  return (
    <>
      <Tooltip content="Open Action" placement="top">
        <motion.button
          aria-label="Choose Open Action"
          className="rounded-full outline-offset-8"
          onClick={() => setShowModal(!showModal)}
          type="button"
          whileTap={{ scale: 0.9 }}
        >
          <SquaresPlusIcon className="size-5" />
        </motion.button>
      </Tooltip>
      <Modal
        icon={
          screen === ScreenType.List && <SquaresPlusIcon className="size-5" />
        }
        onClose={() => {
          setShowModal(false);
          reset();
        }}
        show={showModal}
        title={
          screen === ScreenType.List ? (
            'Open Action Settings'
          ) : (
            <button
              className="flex items-center space-x-2"
              onClick={() => {
                setScreen(ScreenType.List);
                reset();
              }}
            >
              <ChevronLeftIcon className="mt-0.5 size-4 stroke-black" />
              <div>{selectedOpenAction}</div>
            </button>
          )
        }
      >
        <OpenActionsList />
      </Modal>
    </>
  );
};

export default OpenActionSettings;
