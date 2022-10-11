import type { LensterPublication } from '@generated/lenstertypes';
import { Menu, Transition } from '@headlessui/react';
import { DotsHorizontalIcon } from '@heroicons/react/outline';
import { BirdStats } from '@lib/birdstats';
import clsx from 'clsx';
import type { FC } from 'react';
import { Fragment } from 'react';
import { useAppStore } from 'src/store/app';
import { PUBLICATION } from 'src/tracking';

import Delete from './Delete';
import Embed from './Embed';
import Permalink from './Permalink';
import Report from './Report';

interface Props {
  publication: LensterPublication;
  isFullPublication: boolean;
}

const PublicationMenu: FC<Props> = ({ publication, isFullPublication }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const iconClassName = isFullPublication ? 'w-[17px] sm:w-[21px]' : 'w-[15px] sm:w-[18px]';

  return (
    <Menu as="div">
      {({ open }) => (
        <>
          <Menu.Button
            className="p-1.5 rounded-full hover:bg-gray-300 hover:bg-opacity-20"
            onClick={() => {
              BirdStats.track(PUBLICATION.MORE);
            }}
            aria-label="More"
          >
            <DotsHorizontalIcon className={clsx('text-gray-500 dark:text-gray-300', iconClassName)} />
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
              className="absolute py-1 w-max bg-white rounded-xl border shadow-sm dark:bg-gray-900 focus:outline-none z-[5] dark:border-gray-700/80"
            >
              {currentProfile?.id === publication?.profile?.id ? (
                <Delete publication={publication} />
              ) : (
                <Report publication={publication} />
              )}
              <Embed publication={publication} />
              <Permalink publication={publication} />
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default PublicationMenu;
