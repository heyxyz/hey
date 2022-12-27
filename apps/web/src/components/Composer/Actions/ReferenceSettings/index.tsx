import MenuTransition from '@components/Shared/MenuTransition';
import { Menu } from '@headlessui/react';
import { GlobeAltIcon, UserAddIcon, UserGroupIcon, UsersIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { Analytics } from '@lib/analytics';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { ReferenceModules } from 'lens';
import type { FC, ReactNode } from 'react';
import { useReferenceModuleStore } from 'src/store/reference-module';
import { PUBLICATION } from 'src/tracking';

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
      <div className="flex items-center justify-between space-x-2">
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
      <Menu.Button
        as={motion.button}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          Analytics.track(PUBLICATION.NEW.REFERENCE_MODULE.OPEN_REFERENCE_SETTINGS);
        }}
      >
        <div className="text-brand">
          {isEveryone && <GlobeAltIcon className="w-5" />}
          {isMyFollowers && <UsersIcon className="w-5" />}
          {isMyFollows && <UserAddIcon className="w-5" />}
          {isFriendsOfFriends && <UserGroupIcon className="w-5" />}
        </div>
      </Menu.Button>
      <MenuTransition>
        <Menu.Items
          static
          className="absolute py-1 z-[5] mt-2 bg-white rounded-xl border shadow-sm dark:bg-gray-900 focus:outline-none dark:border-gray-700"
        >
          <Module
            title={EVERYONE}
            selected={isEveryone}
            icon={<GlobeAltIcon className="w-4 h-4" />}
            onClick={() => {
              setSelectedReferenceModule(ReferenceModules.FollowerOnlyReferenceModule);
              setOnlyFollowers(false);
              Analytics.track(PUBLICATION.NEW.REFERENCE_MODULE.EVERYONE);
            }}
          />
          <Module
            title={MY_FOLLOWERS}
            selected={isMyFollowers}
            icon={<UsersIcon className="w-4 h-4" />}
            onClick={() => {
              setSelectedReferenceModule(ReferenceModules.FollowerOnlyReferenceModule);
              setOnlyFollowers(true);
              Analytics.track(PUBLICATION.NEW.REFERENCE_MODULE.MY_FOLLOWERS);
            }}
          />
          <Module
            title={MY_FOLLOWS}
            selected={isMyFollows}
            icon={<UserAddIcon className="w-4 h-4" />}
            onClick={() => {
              setSelectedReferenceModule(ReferenceModules.DegreesOfSeparationReferenceModule);
              setDegreesOfSeparation(1);
              Analytics.track(PUBLICATION.NEW.REFERENCE_MODULE.MY_FOLLOWS);
            }}
          />
          <Module
            title={FRIENDS_OF_FRIENDS}
            selected={isFriendsOfFriends}
            icon={<UserGroupIcon className="w-4 h-4" />}
            onClick={() => {
              setSelectedReferenceModule(ReferenceModules.DegreesOfSeparationReferenceModule);
              setDegreesOfSeparation(2);
              Analytics.track(PUBLICATION.NEW.REFERENCE_MODULE.FRIENDS_OF_FRIENDS);
            }}
          />
        </Menu.Items>
      </MenuTransition>
    </Menu>
  );
};

export default ReferenceSettings;
