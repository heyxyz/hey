import { ReferenceModules } from '@generated/types';
import { Menu, Transition } from '@headlessui/react';
import { GlobeAltIcon, UserAddIcon, UserGroupIcon, UsersIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import type { FC, ReactNode } from 'react';
import { Fragment } from 'react';
import { useReferenceModuleStore } from 'src/store/referencemodule';

const ReferenceSettings: FC = () => {
  const selectedReferenceModule = useReferenceModuleStore((state) => state.selectedReferenceModule);
  const setSelectedReferenceModule = useReferenceModuleStore((state) => state.setSelectedReferenceModule);
  const onlyFollowers = useReferenceModuleStore((state) => state.onlyFollowers);
  const setOnlyFollowers = useReferenceModuleStore((state) => state.setOnlyFollowers);
  const degreesOfSeparation = useReferenceModuleStore((state) => state.degreesOfSeparation);
  const setDegreesOfSeparation = useReferenceModuleStore((state) => state.setDegreesOfSeparation);
  const MY_FOLLOWS = 'My follows';
  const MY_FOLLOWERS = 'My followers';
  const FRIENDS_OF_FRIENDS = 'Friends of friends';
  const EVERYONE = 'Everyone';

  const isFollowerOnlyReferenceModule =
    selectedReferenceModule === ReferenceModules.FollowerOnlyReferenceModule;
  const isDegreesOfSeparationReferenceModule =
    selectedReferenceModule === ReferenceModules.DegreesOfSeparationReferenceModule;

  const isEveryone = isFollowerOnlyReferenceModule && !onlyFollowers;
  const isMyFollowers = isFollowerOnlyReferenceModule && onlyFollowers;
  const isMyFollows = isDegreesOfSeparationReferenceModule && degreesOfSeparation === 1;
  const isFriendsOfFriends = isDegreesOfSeparationReferenceModule && degreesOfSeparation === 2;

  interface ModuleProps {
    title: string;
    icon: ReactNode;
    onClick: () => void;
    selected: boolean;
  }

  const Module: FC<ModuleProps> = ({ title, icon, onClick, selected }) => (
    <Menu.Item as="a" className={clsx({ 'dropdown-active': selected }, 'menu-item')} onClick={onClick}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          <div className="text-brand-500">{icon}</div>
          <div>{title}</div>
        </div>
        {selected && <CheckCircleIcon className="w-5 text-green-500" />}
      </div>
    </Menu.Item>
  );

  return (
    <Menu as="div">
      {({ open }) => (
        <>
          <Menu.Button as={motion.button} whileTap={{ scale: 0.9 }}>
            <div className="text-brand">
              {isEveryone && <GlobeAltIcon className="w-5" />}
              {isMyFollowers && <UsersIcon className="w-5" />}
              {isMyFollows && <UserAddIcon className="w-5" />}
              {isFriendsOfFriends && <UserGroupIcon className="w-5" />}
            </div>
          </Menu.Button>
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              static
              className="absolute py-1 z-[5] mt-2 w-52 bg-white rounded-xl border shadow-sm dark:bg-gray-900 focus:outline-none dark:border-gray-700/80"
            >
              <Module
                title={EVERYONE}
                selected={isEveryone}
                icon={<GlobeAltIcon className="w-4 h-4" />}
                onClick={() => {
                  setSelectedReferenceModule(ReferenceModules.FollowerOnlyReferenceModule);
                  setOnlyFollowers(false);
                }}
              />
              <Module
                title={MY_FOLLOWERS}
                selected={isMyFollowers}
                icon={<UsersIcon className="w-4 h-4" />}
                onClick={() => {
                  setSelectedReferenceModule(ReferenceModules.FollowerOnlyReferenceModule);
                  setOnlyFollowers(true);
                }}
              />
              <Module
                title={MY_FOLLOWS}
                selected={isMyFollows}
                icon={<UserAddIcon className="w-4 h-4" />}
                onClick={() => {
                  setSelectedReferenceModule(ReferenceModules.DegreesOfSeparationReferenceModule);
                  setDegreesOfSeparation(1);
                }}
              />
              <Module
                title={FRIENDS_OF_FRIENDS}
                selected={isFriendsOfFriends}
                icon={<UserGroupIcon className="w-4 h-4" />}
                onClick={() => {
                  setSelectedReferenceModule(ReferenceModules.DegreesOfSeparationReferenceModule);
                  setDegreesOfSeparation(2);
                }}
              />
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default ReferenceSettings;
