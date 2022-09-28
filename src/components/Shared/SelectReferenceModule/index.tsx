import { Modal } from '@components/UI/Modal';
import { Tooltip } from '@components/UI/Tooltip';
import { ReferenceModules } from '@generated/types';
import { ChatAlt2Icon, GlobeAltIcon, UsersIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { Mixpanel } from '@lib/mixpanel';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { FC, useState } from 'react';
import { useReferenceModuleStore } from 'src/store/referencemodule';
import { PUBLICATION } from 'src/tracking';

const SelectReferenceModule: FC = () => {
  const [showModal, setShowModal] = useState(false);
  const selectedModule = useReferenceModuleStore((state) => state.selectedModule);
  const setSelectedModule = useReferenceModuleStore((state) => state.setSelectedModule);
  const onlyFollowers = useReferenceModuleStore((state) => state.onlyFollowers);
  const setOnlyFollowers = useReferenceModuleStore((state) => state.setOnlyFollowers);
  const ONLY_FOLLOWERS = 'Only followers can comment or mirror';
  const EVERYONE = 'Everyone can comment or mirror';

  const isFollowerOnlyReferenceModule = selectedModule === ReferenceModules.FollowerOnlyReferenceModule;
  const isDegreesOfSeparationReferenceModule =
    selectedModule === ReferenceModules.DegreesOfSeparationReferenceModule;

  return (
    <>
      <Tooltip placement="top" content={onlyFollowers ? ONLY_FOLLOWERS : EVERYONE}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => {
            setShowModal(!showModal);
            Mixpanel.track(PUBLICATION.NEW.REFERENCE_MODULE.OPEN_COLLECT_CONFIG);
          }}
          aria-label="Choose Reference Module"
        >
          <div className="text-brand">
            {onlyFollowers ? <UsersIcon className="w-5 h-5" /> : <GlobeAltIcon className="w-5 h-5" />}
          </div>
        </motion.button>
      </Tooltip>
      <Modal
        title="Who can comment or mirror"
        icon={<ChatAlt2Icon className="w-5 h-5 text-brand" />}
        show={showModal}
        onClose={() => setShowModal(false)}
      >
        <div className="py-3.5 px-5 space-y-3">
          <button
            type="button"
            className={clsx(
              { 'border-green-500': isDegreesOfSeparationReferenceModule },
              'w-full p-3 border rounded-xl dark:border-gray-700/80 flex justify-between items-center'
            )}
            onClick={() => {
              setSelectedModule(ReferenceModules.DegreesOfSeparationReferenceModule);
              setOnlyFollowers(false);
              Mixpanel.track(PUBLICATION.NEW.REFERENCE_MODULE.EVERYONE);
            }}
          >
            <div className="flex items-center space-x-3">
              <UsersIcon className="w-5 h-5 text-brand" />
              <div>{EVERYONE}</div>
            </div>
            {isDegreesOfSeparationReferenceModule && <CheckCircleIcon className="w-7 text-green-500" />}
          </button>
          <button
            type="button"
            className={clsx(
              {
                'border-green-500': isFollowerOnlyReferenceModule && !onlyFollowers
              },
              'w-full p-3 border rounded-xl dark:border-gray-700/80 flex justify-between items-center'
            )}
            onClick={() => {
              setSelectedModule(ReferenceModules.FollowerOnlyReferenceModule);
              setOnlyFollowers(false);
              setShowModal(false);
              Mixpanel.track(PUBLICATION.NEW.REFERENCE_MODULE.EVERYONE);
            }}
          >
            <div className="flex items-center space-x-3">
              <GlobeAltIcon className="w-5 h-5 text-brand" />
              <div>{EVERYONE}</div>
            </div>
            {isFollowerOnlyReferenceModule && !onlyFollowers && (
              <CheckCircleIcon className="w-7 text-green-500" />
            )}
          </button>
          <button
            type="button"
            className={clsx(
              {
                'border-green-500':
                  selectedModule === ReferenceModules.FollowerOnlyReferenceModule && onlyFollowers
              },
              'w-full p-3 border rounded-xl dark:border-gray-700/80 flex justify-between items-center'
            )}
            onClick={() => {
              setSelectedModule(ReferenceModules.FollowerOnlyReferenceModule);
              setOnlyFollowers(true);
              setShowModal(false);
              Mixpanel.track(PUBLICATION.NEW.REFERENCE_MODULE.ONLY_FOLLOWERS);
            }}
          >
            <div className="flex items-center space-x-3">
              <UsersIcon className="w-5 h-5 text-brand" />
              <div>{ONLY_FOLLOWERS}</div>
            </div>
            {selectedModule === ReferenceModules.FollowerOnlyReferenceModule && onlyFollowers && (
              <CheckCircleIcon className="w-7 h-7 text-green-500" />
            )}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default SelectReferenceModule;
