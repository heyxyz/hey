import type { AnyPublication } from '@hey/lens';
import type { FC } from 'react';

import MenuTransition from '@components/Shared/MenuTransition';
import { Menu } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import cn from '@hey/ui/cn';
import { Fragment } from 'react';
import useProfileStore from 'src/store/persisted/useProfileStore';

import Bookmark from './Bookmark';
import CopyPostText from './CopyPostText';
import Delete from './Delete';
import NotInterested from './NotInterested';
import Report from './Report';
import Share from './Share';
import Translate from './Translate';

interface PublicationMenuProps {
  publication: AnyPublication;
}

const PublicationMenu: FC<PublicationMenuProps> = ({ publication }) => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const iconClassName = 'w-[15px] sm:w-[18px]';

  return (
    <Menu as="div" className="relative">
      <Menu.Button as={Fragment}>
        <button
          aria-label="More"
          className="outline-brand-500 rounded-full p-1.5 hover:bg-gray-300/20"
          onClick={stopEventPropagation}
          type="button"
        >
          <EllipsisVerticalIcon
            className={cn('ld-text-gray-500', iconClassName)}
          />
        </button>
      </Menu.Button>
      <MenuTransition>
        <Menu.Items
          className="absolute right-0 z-[5] mt-1 w-max rounded-xl border bg-white shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
          static
        >
          {currentProfile?.id === publication?.by?.id ? (
            <Delete publication={publication} />
          ) : (
            <Report publication={publication} />
          )}
          {currentProfile ? (
            <>
              <NotInterested publication={publication} />
              <Bookmark publication={publication} />
            </>
          ) : null}
          <Share publication={publication} />
          <Translate publication={publication} />
          <CopyPostText publication={publication} />
        </Menu.Items>
      </MenuTransition>
    </Menu>
  );
};

export default PublicationMenu;
