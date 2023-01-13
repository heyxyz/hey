import MenuTransition from '@components/Shared/MenuTransition';
import { Menu } from '@headlessui/react';
import { DotsVerticalIcon } from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import clsx from 'clsx';
import type { Publication } from 'lens';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';
import { PUBLICATION } from 'src/tracking';

import Delete from './Delete';
import Embed from './Embed';
import Permalink from './Permalink';
import Report from './Report';

interface Props {
  publication: Publication;
}

const PublicationMenu: FC<Props> = ({ publication }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const iconClassName = 'w-[15px] sm:w-[18px]';

  return (
    <Menu as="div" className="relative">
      <Menu.Button
        className="p-1.5 rounded-full hover:bg-gray-300 hover:bg-opacity-20"
        onClick={(event: any) => {
          event.stopPropagation();
          Analytics.track(PUBLICATION.MORE);
        }}
        aria-label="More"
      >
        <DotsVerticalIcon className={clsx('lt-text-gray-500', iconClassName)} />
      </Menu.Button>
      <MenuTransition>
        <Menu.Items
          static
          className="absolute right-0 mt-1 w-max bg-white rounded-xl border shadow-sm dark:bg-gray-900 focus:outline-none z-[5] dark:border-gray-700"
        >
          {currentProfile?.id === publication?.profile?.id ? (
            <Delete publication={publication} />
          ) : (
            <Report publication={publication} />
          )}
          <Embed publication={publication} />
          <Permalink publication={publication} />
        </Menu.Items>
      </MenuTransition>
    </Menu>
  );
};

export default PublicationMenu;
