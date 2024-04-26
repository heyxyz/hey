import type { AnyPublication } from '@hey/lens';
import type { FC } from 'react';

import MenuTransition from '@components/Shared/MenuTransition';
import { Menu } from '@headlessui/react';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import stopEventPropagation from '@hey/helpers/stopEventPropagation';
import cn from '@hey/ui/cn';
import { Fragment } from 'react';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import Bookmark from './Bookmark';
import CopyPostText from './CopyPostText';
import Delete from './Delete';
import HideComment from './HideComment';
import NotInterested from './NotInterested';
import Report from './Report';
import Share from './Share';
import Translate from './Translate';

interface PublicationMenuProps {
  publication: AnyPublication;
}

const PublicationMenu: FC<PublicationMenuProps> = ({ publication }) => {
  const { currentProfile } = useProfileStore();
  const iconClassName = 'w-[15px] sm:w-[18px]';

  return (
    <Menu as="div" className="relative">
      <Menu.Button as={Fragment}>
        <button
          aria-label="More"
          className="rounded-full p-1.5 hover:bg-gray-300/20"
          onClick={stopEventPropagation}
          type="button"
        >
          <EllipsisHorizontalIcon
            className={cn('ld-text-gray-500', iconClassName)}
          />
        </button>
      </Menu.Button>
      <MenuTransition>
        <Menu.Items
          className="absolute right-0 z-[5] mt-1 w-max rounded-xl border bg-white shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
          static
        >
          {currentProfile ? (
            <>
              {currentProfile?.id === publication?.by?.id ? (
                <Delete publication={publication} />
              ) : (
                <Report publication={publication} />
              )}
              <NotInterested publication={publication} />
              <HideComment publication={publication} />
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
