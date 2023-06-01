import MenuTransition from '@components/Shared/MenuTransition';
import { Menu } from '@headlessui/react';
import {
  GlobeAltIcon,
  UserAddIcon,
  UserGroupIcon,
  UsersIcon
} from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { ReferenceModules } from '@lenster/lens';
import { Tooltip } from '@lenster/ui';
import { t } from '@lingui/macro';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import type { FC, ReactNode } from 'react';
import { useReferenceModuleStore } from 'src/store/reference-module';

const ReferenceSettings: FC = () => {
  const selectedReferenceModule = useReferenceModuleStore(
    (state) => state.selectedReferenceModule
  );
  const setSelectedReferenceModule = useReferenceModuleStore(
    (state) => state.setSelectedReferenceModule
  );
  const onlyFollowers = useReferenceModuleStore((state) => state.onlyFollowers);
  const setOnlyFollowers = useReferenceModuleStore(
    (state) => state.setOnlyFollowers
  );
  const degreesOfSeparation = useReferenceModuleStore(
    (state) => state.degreesOfSeparation
  );
  const setDegreesOfSeparation = useReferenceModuleStore(
    (state) => state.setDegreesOfSeparation
  );
  const MY_FOLLOWS = t`My follows`;
  const MY_FOLLOWERS = t`My followers`;
  const FRIENDS_OF_FRIENDS = t`Friends of friends`;
  const EVERYONE = t`Everyone`;

  const isFollowerOnlyReferenceModule =
    selectedReferenceModule === ReferenceModules.FollowerOnlyReferenceModule;
  const isDegreesOfSeparationReferenceModule =
    selectedReferenceModule ===
    ReferenceModules.DegreesOfSeparationReferenceModule;

  const isEveryone = isFollowerOnlyReferenceModule && !onlyFollowers;
  const isMyFollowers = isFollowerOnlyReferenceModule && onlyFollowers;
  const isMyFollows =
    isDegreesOfSeparationReferenceModule && degreesOfSeparation === 1;
  const isFriendsOfFriends =
    isDegreesOfSeparationReferenceModule && degreesOfSeparation === 2;

  interface ModuleProps {
    title: string;
    icon: ReactNode;
    onClick: () => void;
    selected: boolean;
  }

  const Module: FC<ModuleProps> = ({ title, icon, onClick, selected }) => (
    <Menu.Item
      as="a"
      className={clsx({ 'dropdown-active': selected }, 'menu-item')}
      onClick={onClick}
    >
      <div className="flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-1.5">
          <div className="text-brand">{icon}</div>
          <div>{title}</div>
        </div>
        {selected && <CheckCircleIcon className="w-5 text-green-500" />}
      </div>
    </Menu.Item>
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
    <Menu as="div">
      <Tooltip
        placement="top"
        content={getSelectedReferenceModuleTooltipText()}
      >
        <Menu.Button as={motion.button} whileTap={{ scale: 0.9 }}>
          <div className="text-brand">
            {isEveryone && <GlobeAltIcon className="w-5" />}
            {isMyFollowers && <UsersIcon className="w-5" />}
            {isMyFollows && <UserAddIcon className="w-5" />}
            {isFriendsOfFriends && <UserGroupIcon className="w-5" />}
          </div>
        </Menu.Button>
      </Tooltip>
      <MenuTransition>
        <Menu.Items
          static
          className="absolute z-[5] mt-2 rounded-xl border bg-white py-1 shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
        >
          <Module
            title={EVERYONE}
            selected={isEveryone}
            icon={<GlobeAltIcon className="h-4 w-4" />}
            onClick={() => {
              setSelectedReferenceModule(
                ReferenceModules.FollowerOnlyReferenceModule
              );
              setOnlyFollowers(false);
            }}
          />
          <Module
            title={MY_FOLLOWERS}
            selected={isMyFollowers}
            icon={<UsersIcon className="h-4 w-4" />}
            onClick={() => {
              setSelectedReferenceModule(
                ReferenceModules.FollowerOnlyReferenceModule
              );
              setOnlyFollowers(true);
            }}
          />
          <Module
            title={MY_FOLLOWS}
            selected={isMyFollows}
            icon={<UserAddIcon className="h-4 w-4" />}
            onClick={() => {
              setSelectedReferenceModule(
                ReferenceModules.DegreesOfSeparationReferenceModule
              );
              setDegreesOfSeparation(1);
            }}
          />
          <Module
            title={FRIENDS_OF_FRIENDS}
            selected={isFriendsOfFriends}
            icon={<UserGroupIcon className="h-4 w-4" />}
            onClick={() => {
              setSelectedReferenceModule(
                ReferenceModules.DegreesOfSeparationReferenceModule
              );
              setDegreesOfSeparation(2);
            }}
          />
        </Menu.Items>
      </MenuTransition>
    </Menu>
  );
};

export default ReferenceSettings;
