import type { FC, ReactNode } from 'react';

import MenuTransition from '@components/Shared/MenuTransition';
import { Menu } from '@headlessui/react';
import {
  GlobeAltIcon,
  UserGroupIcon,
  UserPlusIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { ReferenceModuleType } from '@hey/lens';
import { Tooltip } from '@hey/ui';
import cn from '@hey/ui/cn';
import { motion } from 'framer-motion';
import { useReferenceModuleStore } from 'src/store/non-persisted/useReferenceModuleStore';

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

  const MY_FOLLOWS = 'My follows';
  const MY_FOLLOWERS = 'My followers';
  const FRIENDS_OF_FRIENDS = 'Friends of friends';
  const EVERYONE = 'Everyone';

  const isFollowerOnlyReferenceModule =
    selectedReferenceModule === ReferenceModuleType.FollowerOnlyReferenceModule;
  const isDegreesOfSeparationReferenceModule =
    selectedReferenceModule ===
    ReferenceModuleType.DegreesOfSeparationReferenceModule;

  const isEveryone = isFollowerOnlyReferenceModule && !onlyFollowers;
  const isMyFollowers = isFollowerOnlyReferenceModule && onlyFollowers;
  const isMyFollows =
    isDegreesOfSeparationReferenceModule && degreesOfSeparation === 1;
  const isFriendsOfFriends =
    isDegreesOfSeparationReferenceModule && degreesOfSeparation === 2;

  interface ModuleProps {
    icon: ReactNode;
    onClick: () => void;
    selected: boolean;
    title: string;
  }

  const Module: FC<ModuleProps> = ({ icon, onClick, selected, title }) => (
    <Menu.Item
      as="a"
      className={cn({ 'dropdown-active': selected }, 'menu-item')}
      onClick={onClick}
    >
      <div className="flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-1.5">
          <div className="text-brand-500">{icon}</div>
          <div>{title}</div>
        </div>
        {selected ? <CheckCircleIcon className="w-5 text-green-500" /> : null}
      </div>
    </Menu.Item>
  );

  const getSelectedReferenceModuleTooltipText = () => {
    if (isMyFollowers) {
      return 'My followers can comment and mirror';
    }

    if (isMyFollows) {
      return 'My follows can comment and mirror';
    }

    if (isFriendsOfFriends) {
      return 'Friend of friends can comment and mirror';
    }

    return 'Everyone can comment and mirror';
  };

  return (
    <Menu as="div">
      <Tooltip
        content={getSelectedReferenceModuleTooltipText()}
        placement="top"
      >
        <Menu.Button
          as={motion.button}
          className="outline-brand-500 rounded-full outline-offset-8"
          whileTap={{ scale: 0.9 }}
        >
          <div className="text-brand-500">
            {isEveryone ? <GlobeAltIcon className="w-5" /> : null}
            {isMyFollowers ? <UsersIcon className="w-5" /> : null}
            {isMyFollows ? <UserPlusIcon className="w-5" /> : null}
            {isFriendsOfFriends ? <UserGroupIcon className="w-5" /> : null}
          </div>
        </Menu.Button>
      </Tooltip>
      <MenuTransition>
        <Menu.Items
          className="absolute z-[5] mt-2 rounded-xl border bg-white py-1 shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
          static
        >
          <Module
            icon={<GlobeAltIcon className="size-4" />}
            onClick={() => {
              setSelectedReferenceModule(
                ReferenceModuleType.FollowerOnlyReferenceModule
              );
              setOnlyFollowers(false);
            }}
            selected={isEveryone}
            title={EVERYONE}
          />
          <Module
            icon={<UsersIcon className="size-4" />}
            onClick={() => {
              setSelectedReferenceModule(
                ReferenceModuleType.FollowerOnlyReferenceModule
              );
              setOnlyFollowers(true);
            }}
            selected={isMyFollowers}
            title={MY_FOLLOWERS}
          />
          <Module
            icon={<UserPlusIcon className="size-4" />}
            onClick={() => {
              setSelectedReferenceModule(
                ReferenceModuleType.DegreesOfSeparationReferenceModule
              );
              setDegreesOfSeparation(1);
            }}
            selected={isMyFollows}
            title={MY_FOLLOWS}
          />
          <Module
            icon={<UserGroupIcon className="size-4" />}
            onClick={() => {
              setSelectedReferenceModule(
                ReferenceModuleType.DegreesOfSeparationReferenceModule
              );
              setDegreesOfSeparation(2);
            }}
            selected={isFriendsOfFriends}
            title={FRIENDS_OF_FRIENDS}
          />
        </Menu.Items>
      </MenuTransition>
    </Menu>
  );
};

export default ReferenceSettings;
