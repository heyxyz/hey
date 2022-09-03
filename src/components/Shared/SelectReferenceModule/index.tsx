import { Modal } from '@components/UI/Modal';
import { Tooltip } from '@components/UI/Tooltip';
import { ChatAlt2Icon, GlobeAltIcon, UsersIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { Hog } from '@lib/hog';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { Dispatch, FC, useState } from 'react';
import { PUBLICATION } from 'src/tracking';

interface Props {
  setOnlyFollowers: Dispatch<boolean>;
  onlyFollowers: boolean;
}

const SelectReferenceModule: FC<Props> = ({ setOnlyFollowers, onlyFollowers }) => {
  const [showModal, setShowModal] = useState(false);
  const ONLY_FOLLOWERS = 'Only followers can comment or mirror';
  const EVERYONE = 'Everyone can comment or mirror';

  return (
    <>
      <Tooltip placement="top" content={onlyFollowers ? ONLY_FOLLOWERS : EVERYONE}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => {
            setShowModal(!showModal);
            Hog.track(PUBLICATION.NEW.REFERENCE_MODULE.OPEN_COLLECT_CONFIG);
          }}
          aria-label="Choose Reference Module"
        >
          <div className="text-brand">
            {onlyFollowers ? <UsersIcon className="w-5 h-5" /> : <GlobeAltIcon className="w-5 h-5" />}
          </div>
        </motion.button>
      </Tooltip>
      <Modal
        title="Select who to comment or mirror"
        icon={<ChatAlt2Icon className="w-5 h-5 text-brand" />}
        show={showModal}
        onClose={() => setShowModal(false)}
      >
        <div className="py-3.5 px-5 space-y-3">
          <button
            type="button"
            className={clsx(
              { 'border-green-500': !onlyFollowers },
              'w-full p-3 border rounded-xl dark:border-gray-700/80 flex justify-between items-center'
            )}
            onClick={() => {
              setOnlyFollowers(false);
              setShowModal(false);
              Hog.track(PUBLICATION.NEW.REFERENCE_MODULE.EVERYONE);
            }}
          >
            <div className="flex items-center space-x-3">
              <GlobeAltIcon className="w-5 h-5 text-brand" />
              <div>{EVERYONE}</div>
            </div>
            {!onlyFollowers && <CheckCircleIcon className="w-7 text-green-500" />}
          </button>
          <button
            type="button"
            className={clsx(
              { 'border-green-500': onlyFollowers },
              'w-full p-3 border rounded-xl dark:border-gray-700/80 flex justify-between items-center'
            )}
            onClick={() => {
              setOnlyFollowers(true);
              setShowModal(false);
              Hog.track(PUBLICATION.NEW.REFERENCE_MODULE.ONLY_FOLLOWERS);
            }}
          >
            <div className="flex items-center space-x-3">
              <UsersIcon className="w-5 h-5 text-brand" />
              <div>{ONLY_FOLLOWERS}</div>
            </div>
            {onlyFollowers && <CheckCircleIcon className="w-7 h-7 text-green-500" />}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default SelectReferenceModule;
