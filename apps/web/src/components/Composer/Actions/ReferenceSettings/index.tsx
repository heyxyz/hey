import MenuTransition from '@components/Shared/MenuTransition';
import { Popover } from '@headlessui/react';
import { GlobeAltIcon, UserAddIcon, UserGroupIcon, UsersIcon } from '@heroicons/react/outline';
import { t, Trans } from '@lingui/macro';
import { motion } from 'framer-motion';
import { ReferenceModules } from 'lens';
import type { FC, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useReferenceModuleStore } from 'src/store/reference-module';
import { Button, Modal, Tooltip } from 'ui';

const ReferenceSettings: FC = () => {
  const selectedReferenceModule = useReferenceModuleStore((state) => state.selectedReferenceModule);
  const setSelectedReferenceModule = useReferenceModuleStore((state) => state.setSelectedReferenceModule);
  const onlyFollowers = useReferenceModuleStore((state) => state.onlyFollowers);
  const setOnlyFollowers = useReferenceModuleStore((state) => state.setOnlyFollowers);
  const degreesOfSeparation = useReferenceModuleStore((state) => state.degreesOfSeparation);
  const setDegreesOfSeparation = useReferenceModuleStore((state) => state.setDegreesOfSeparation);
  const [showModal, setShowModal] = useState(false);
  const rangeValues = ['1', '34', '67', '100'];
  const MY_FOLLOWS = { title: t`My follows`, description: t`Only people who I follow`, value: '1' };
  const MY_FOLLOWERS = { title: t`My followers`, description: t`Only people who follow me`, value: '34' };
  const FRIENDS_OF_FRIENDS = {
    title: t`Friends of friends`,
    description: t`People who my followers follow`,
    value: '67'
  };
  const EVERYONE = { title: t`Everyone`, description: t`No restrictions`, value: '100' };
  const isFollowerOnlyReferenceModule =
    selectedReferenceModule === ReferenceModules.FollowerOnlyReferenceModule;
  const isDegreesOfSeparationReferenceModule =
    selectedReferenceModule === ReferenceModules.DegreesOfSeparationReferenceModule;

  const isEveryone = isFollowerOnlyReferenceModule && !onlyFollowers;
  const isMyFollowers = isFollowerOnlyReferenceModule && onlyFollowers;
  const isMyFollows = isDegreesOfSeparationReferenceModule && degreesOfSeparation === 1;
  const isFriendsOfFriends = isDegreesOfSeparationReferenceModule && degreesOfSeparation === 2;
  const [followValue, setfollowValue] = useState(
    isMyFollows
      ? MY_FOLLOWS.value
      : isMyFollowers
      ? MY_FOLLOWERS.value
      : isFriendsOfFriends
      ? FRIENDS_OF_FRIENDS.value
      : isEveryone
      ? EVERYONE.value
      : EVERYONE.value
  );

  interface ModuleProps {
    title: string;
    description: string;
    icon: ReactNode;
  }
  const getClosest = (arr: string[], val: string) => {
    return arr.reduce(function (prev, curr) {
      return Math.abs(Number(curr) - Number(val)) < Math.abs(Number(prev) - Number(val)) ? curr : prev;
    });
  };

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    let closest = getClosest(rangeValues, event.currentTarget.value);
    setfollowValue(closest);
  };

  useEffect(() => {
    switch (followValue) {
      case MY_FOLLOWS.value:
        setSelectedReferenceModule(ReferenceModules.DegreesOfSeparationReferenceModule);
        setDegreesOfSeparation(1);
        break;
      case MY_FOLLOWERS.value:
        setSelectedReferenceModule(ReferenceModules.FollowerOnlyReferenceModule);
        setOnlyFollowers(true);
        break;
      case FRIENDS_OF_FRIENDS.value:
        setSelectedReferenceModule(ReferenceModules.DegreesOfSeparationReferenceModule);
        setDegreesOfSeparation(2);
        break;
      case EVERYONE.value:
        setSelectedReferenceModule(ReferenceModules.FollowerOnlyReferenceModule);
        setOnlyFollowers(false);
        break;
      default:
        break;
    }
  }, [followValue]);

  const Module: FC<ModuleProps> = ({ title, description, icon }) => (
    <div className="flex items-center space-x-3">
      {title === EVERYONE.title && (
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="bg-brand-500 absolute h-12 w-12 rounded-full opacity-70 mix-blend-multiply blur-md filter" />
          <div className="bg-brand-500 absolute h-8 w-8 rounded-full opacity-50 mix-blend-multiply blur-sm filter" />
          <div className="text-brand-100 absolute">{icon}</div>
        </div>
      )}
      {title !== EVERYONE.title && (
        <div className="border-brand-300 dark:border-brand-400 rounded-full border-2 p-1.5">
          <div className="border-brand-300 dark:border-brand-400 rounded-full border-2 p-2">
            <div className="bg-brand-500 border-brand-500 rounded-full border-2 bg-opacity-30 p-2.5">
              <div className="bg-brand-500 rounded-full p-1">
                <div className="text-brand-100">{icon}</div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div>
        <div className="text-brand-500 text-lg font-semibold">{title}</div>
        <div>{description}</div>
      </div>
    </div>
  );

  const Slider: FC = () => (
    <div className="flex w-full flex-col space-y-2">
      <input
        type="range"
        className="accent-brand-500"
        onChange={handleChange}
        min="1"
        max="100"
        step="1"
        defaultValue={followValue}
      />
      <ul className="flex items-start justify-between text-sm">
        <li className="flex w-4 flex-col items-center space-y-2">
          <UserAddIcon className="text-brand-500 h-4 w-4" />{' '}
          <span
            className={isMyFollows ? 'text-brand-500 text-center leading-tight' : 'text-center leading-tight'}
          >
            {MY_FOLLOWS.title}
          </span>
        </li>
        <li className="flex w-4 flex-col items-center space-y-2">
          <UsersIcon className="text-brand-500 h-4 w-4" />{' '}
          <span
            className={
              isMyFollowers ? 'text-brand-500 text-center leading-tight' : 'text-center leading-tight'
            }
          >
            {MY_FOLLOWERS.title}
          </span>
        </li>
        <li className="flex w-4 flex-col items-center space-y-2">
          <UserGroupIcon className="text-brand-500 h-4 w-4" />
          <span
            className={
              isFriendsOfFriends ? 'text-brand-500 text-center leading-tight' : 'text-center leading-tight'
            }
          >
            {FRIENDS_OF_FRIENDS.title}
          </span>
        </li>
        <li className="flex w-4 flex-col items-center space-y-2">
          <GlobeAltIcon className="text-brand-500 h-4 w-4" />
          <span
            className={isEveryone ? 'text-brand-500 text-center leading-tight' : 'text-center leading-tight'}
          >
            {EVERYONE.title}
          </span>
        </li>
      </ul>
    </div>
  );

  const getSelectedReferenceModuleTooltipText = () => {
    if (isMyFollowers) {
      return t`My followers can comment and mirror`;
    } else if (isMyFollows) {
      return t`My follows can comment and mirror`;
    } else if (isFriendsOfFriends) {
      return t`Friend of friends can comment and mirror`;
    } else {
      return t`Everyone can comment and mirror`;
    }
  };

  return (
    <>
      <div className="block md:hidden">
        <Tooltip placement="top" content={getSelectedReferenceModuleTooltipText()}>
          <motion.button onClick={() => setShowModal(true)} whileTap={{ scale: 0.9 }}>
            <div className="text-brand">
              {isEveryone && <GlobeAltIcon className="w-5" />}
              {isMyFollowers && <UsersIcon className="w-5" />}
              {isMyFollows && <UserAddIcon className="w-5" />}
              {isFriendsOfFriends && <UserGroupIcon className="w-5" />}
            </div>
          </motion.button>
        </Tooltip>
        <Modal
          title={t`Who can comment?`}
          icon={
            <>
              {isEveryone && <GlobeAltIcon className="w-5" />}
              {isMyFollowers && <UsersIcon className="w-5" />}
              {isMyFollows && <UserAddIcon className="w-5" />}
              {isFriendsOfFriends && <UserGroupIcon className="w-5" />}
            </>
          }
          show={showModal}
          onClose={() => {
            setShowModal(false);
          }}
        >
          <div className="flex flex-col items-start justify-between space-y-4 px-10 py-5">
            {isEveryone && (
              <Module
                title={EVERYONE.title}
                description={EVERYONE.description}
                icon={<GlobeAltIcon className="h-4 w-4" />}
              />
            )}
            {isMyFollowers && (
              <Module
                title={MY_FOLLOWERS.title}
                description={MY_FOLLOWERS.description}
                icon={<UsersIcon className="h-4 w-4" />}
              />
            )}
            {isMyFollows && (
              <Module
                title={MY_FOLLOWS.title}
                description={MY_FOLLOWS.description}
                icon={<UserAddIcon className="h-4 w-4" />}
              />
            )}
            {isFriendsOfFriends && (
              <Module
                title={FRIENDS_OF_FRIENDS.title}
                description={FRIENDS_OF_FRIENDS.description}
                icon={<UserGroupIcon className="h-4 w-4" />}
              />
            )}
            <Slider />
            <div className="flex w-full justify-end pt-5">
              <Button onClick={() => setShowModal(false)}>
                <Trans>Done</Trans>
              </Button>
            </div>
          </div>
        </Modal>
      </div>
      <div className="hidden md:block">
        <Popover className="relative">
          <Tooltip placement="top" content={getSelectedReferenceModuleTooltipText()}>
            <Popover.Button as={motion.button} whileTap={{ scale: 0.9 }}>
              <div className="text-brand">
                {isEveryone && <GlobeAltIcon className="w-5" />}
                {isMyFollowers && <UsersIcon className="w-5" />}
                {isMyFollows && <UserAddIcon className="w-5" />}
                {isFriendsOfFriends && <UserGroupIcon className="w-5" />}
              </div>
            </Popover.Button>
          </Tooltip>
          <MenuTransition>
            <Popover.Panel className="absolute z-[5] mt-2 w-screen max-w-sm rounded-xl border bg-white px-3 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <div className=" mb-2 font-medium">Who can comment?</div>
              <div className="flex flex-col items-start justify-between space-y-2 px-6">
                {isEveryone && (
                  <Module
                    title={EVERYONE.title}
                    description={EVERYONE.description}
                    icon={<GlobeAltIcon className="h-4 w-4" />}
                  />
                )}
                {isMyFollowers && (
                  <Module
                    title={MY_FOLLOWERS.title}
                    description={MY_FOLLOWERS.description}
                    icon={<UsersIcon className="h-4 w-4" />}
                  />
                )}
                {isMyFollows && (
                  <Module
                    title={MY_FOLLOWS.title}
                    description={MY_FOLLOWS.description}
                    icon={<UserAddIcon className="h-4 w-4" />}
                  />
                )}
                {isFriendsOfFriends && (
                  <Module
                    title={FRIENDS_OF_FRIENDS.title}
                    description={FRIENDS_OF_FRIENDS.description}
                    icon={<UserGroupIcon className="h-4 w-4" />}
                  />
                )}
                <Slider />
              </div>
            </Popover.Panel>
          </MenuTransition>
        </Popover>
      </div>
    </>
  );
};

export default ReferenceSettings;
