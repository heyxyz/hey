import type { MirrorablePublication } from '@hey/lens';
import type { FC } from 'react';

import MenuTransition from '@components/Shared/MenuTransition';
import { Menu, MenuButton, MenuItems } from '@headlessui/react';
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
import Pin from './Pin';
import Recommend from './Recommend';
import Report from './Report';
import Share from './Share';
import Translate from './Translate';

interface PublicationMenuProps {
  publication: MirrorablePublication;
}

const PublicationMenu: FC<PublicationMenuProps> = ({ publication }) => {
  const { currentProfile } = useProfileStore();
  const iconClassName = 'w-[15px] sm:w-[18px]';

  return (
    <Menu as="div" className="relative">
      <MenuButton as={Fragment}>
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
      </MenuButton>
      <MenuTransition>
        <MenuItems
          className="absolute right-0 z-[5] mt-1 w-max rounded-xl border bg-white shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
          static
        >
          {currentProfile ? (
            <>
              {currentProfile?.id === publication?.by?.id ? (
                <Pin publication={publication} />
              ) : null}
              <NotInterested publication={publication} />
              <Recommend publication={publication} />
              <HideComment publication={publication} />
              <Bookmark publication={publication} />
            </>
          ) : null}
          <div className="divider" />
          <Share publication={publication} />
          <Translate publication={publication} />
          <CopyPostText publication={publication} />
          <div className="divider" />
          {currentProfile?.id === publication?.by?.id ? (
            <Delete publication={publication} />
          ) : (
            <Report publication={publication} />
          )}
        </MenuItems>
      </MenuTransition>
    </Menu>
  );
};

export default PublicationMenu;
