import { Modal } from '@components/UI/Modal';
import { Tooltip } from '@components/UI/Tooltip';
import { ReferenceModules } from '@generated/types';
import { ChatAlt2Icon, GlobeAltIcon, UserIcon, UsersIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { Mixpanel } from '@lib/mixpanel';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { FC, useState } from 'react';
import { useReferenceModuleStore } from 'src/store/referencemodule';
import { PUBLICATION } from 'src/tracking';

const SelectReferenceModule: FC = () => {
  const [showModal, setShowModal] = useState(false);
  const selectedReferenceModule = useReferenceModuleStore((state) => state.selectedReferenceModule);
  const setSelectedReferenceModule = useReferenceModuleStore((state) => state.setSelectedReferenceModule);
  const onlyFollowers = useReferenceModuleStore((state) => state.onlyFollowers);
  const setOnlyFollowers = useReferenceModuleStore((state) => state.setOnlyFollowers);
  const { commentsRestricted, mirrorsRestricted, degreesOfSeparation } = useReferenceModuleStore();
  const { setCommentsRestricted, setMirrorsRestricted, setDegreesOfSeparation } = useReferenceModuleStore();
  const ONLY_FOLLOWERS = 'Only followers can comment or mirror';
  const EVERYONE = 'Everyone can comment or mirror';
  const RESTRICTED = `Restricted to ${
    commentsRestricted ? 'comments' : 'mirrors'
  } upto ${degreesOfSeparation} degrees`;

  const isFollowerOnlyReferenceModule =
    selectedReferenceModule === ReferenceModules.FollowerOnlyReferenceModule;
  const isDegreesOfSeparationReferenceModule =
    selectedReferenceModule === ReferenceModules.DegreesOfSeparationReferenceModule;

  const buttonClass =
    'w-full p-3 border rounded-xl dark:border-gray-700/80 flex justify-between items-center';

  return (
    <>
      <Tooltip
        placement="top"
        content={
          isDegreesOfSeparationReferenceModule ? RESTRICTED : onlyFollowers ? ONLY_FOLLOWERS : EVERYONE
        }
      >
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
            {isDegreesOfSeparationReferenceModule ? (
              <UsersIcon className="w-5 h-5" />
            ) : onlyFollowers ? (
              <UserIcon className="w-5 h-5" />
            ) : (
              <GlobeAltIcon className="w-5 h-5" />
            )}
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
              { 'border-green-500': isFollowerOnlyReferenceModule && !onlyFollowers },
              buttonClass
            )}
            onClick={() => {
              setSelectedReferenceModule(ReferenceModules.FollowerOnlyReferenceModule);
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
              { 'border-green-500': isFollowerOnlyReferenceModule && onlyFollowers },
              buttonClass
            )}
            onClick={() => {
              setSelectedReferenceModule(ReferenceModules.FollowerOnlyReferenceModule);
              setOnlyFollowers(true);
              setShowModal(false);
              Mixpanel.track(PUBLICATION.NEW.REFERENCE_MODULE.ONLY_FOLLOWERS);
            }}
          >
            <div className="flex items-center space-x-3">
              <UserIcon className="w-5 h-5 text-brand" />
              <div>{ONLY_FOLLOWERS}</div>
            </div>
            {isFollowerOnlyReferenceModule && onlyFollowers && (
              <CheckCircleIcon className="w-7 h-7 text-green-500" />
            )}
          </button>
          <button
            type="button"
            className={clsx({ 'border-green-500': isDegreesOfSeparationReferenceModule }, buttonClass)}
            onClick={() => {
              setSelectedReferenceModule(ReferenceModules.DegreesOfSeparationReferenceModule);
              setOnlyFollowers(false);
              Mixpanel.track(PUBLICATION.NEW.REFERENCE_MODULE.DEGREES);
            }}
          >
            <div className="flex items-center space-x-3 text-left">
              <UsersIcon className="w-5 h-5 text-brand" />
              <div className="max-w-[90%]">
                Restrict{' '}
                <select
                  className="py-0.5 mx-1 rounded-lg text-sm"
                  onChange={(event) => {
                    // @ts-ignore
                    const value = event.target.value;

                    setCommentsRestricted(value === 'comments');
                    setMirrorsRestricted(value === 'mirrors');
                  }}
                >
                  <option value="comments" selected={commentsRestricted}>
                    comments
                  </option>
                  <option value="mirrors" selected={mirrorsRestricted}>
                    mirrors
                  </option>
                </select>
                to people up to{' '}
                <select
                  className="py-0.5 mx-1 rounded-lg text-sm mt-1"
                  onChange={(event) => {
                    // @ts-ignore
                    const value = event.target.value;
                    setDegreesOfSeparation(parseInt(value));
                  }}
                >
                  <option value={1} selected={degreesOfSeparation === 1}>
                    1 degree
                  </option>
                  <option value={2} selected={degreesOfSeparation === 2}>
                    2 degrees
                  </option>
                  <option value={3} selected={degreesOfSeparation === 3}>
                    3 degrees
                  </option>
                  <option value={4} selected={degreesOfSeparation === 4}>
                    4 degrees
                  </option>
                </select>{' '}
                away from me in my network
              </div>
            </div>
            {isDegreesOfSeparationReferenceModule && <CheckCircleIcon className="w-7 text-green-500" />}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default SelectReferenceModule;
