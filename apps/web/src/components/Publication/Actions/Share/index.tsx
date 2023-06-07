import MenuTransition from '@components/Shared/MenuTransition';
import { Menu } from '@headlessui/react';
import { SwitchHorizontalIcon } from '@heroicons/react/outline';
import type { Publication } from '@lenster/lens';
import humanize from '@lenster/lib/humanize';
import nFormatter from '@lenster/lib/nFormatter';
import stopEventPropagation from '@lenster/lib/stopEventPropagation';
import { Tooltip } from '@lenster/ui';
import { t } from '@lingui/macro';
import clsx from 'clsx';
import type { FC } from 'react';
import { Fragment, useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

import Mirror from './Mirror';

interface PublicationMenuProps {
  publication: Publication;
  showCount: boolean;
}

const ShareMenu: FC<PublicationMenuProps> = ({ publication, showCount }) => {
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef(null);

  const isMirror = publication.__typename === 'Mirror';
  const count = isMirror
    ? publication?.mirrorOf?.stats?.totalAmountOfMirrors
    : publication?.stats?.totalAmountOfMirrors;
  const mirrored = isMirror
    ? publication?.mirrorOf?.mirrors?.length > 0
    : // @ts-expect-error
      publication?.mirrors?.length > 0;
  const iconClassName = 'w-[15px] sm:w-[18px]';

  useOnClickOutside(dropdownRef, () => setShowMenu(false));

  return (
    <div
      className={clsx(
        mirrored ? 'text-green-500' : 'text-brand',
        'flex items-center space-x-1'
      )}
    >
      <Menu as="div" className="relative">
        <Menu.Button as={Fragment}>
          <button
            className="rounded-full p-1.5 hover:bg-gray-300/20"
            onClick={(event) => {
              stopEventPropagation(event);
              setShowMenu(!showMenu);
            }}
            aria-label="Mirror"
          >
            <Tooltip
              placement="top"
              content={count > 0 ? t`${humanize(count)} Mirrors` : t`Mirror`}
              withDelay
            >
              <SwitchHorizontalIcon className={iconClassName} />
            </Tooltip>
          </button>
        </Menu.Button>
        <MenuTransition show={showMenu}>
          <Menu.Items
            ref={dropdownRef}
            className="absolute z-[5] mt-1 w-max rounded-xl border bg-white shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
            static
          >
            <Mirror publication={publication} />
          </Menu.Items>
        </MenuTransition>
      </Menu>
      {count > 0 && !showCount && (
        <span className="text-[11px] sm:text-xs">{nFormatter(count)}</span>
      )}
    </div>
  );
};

export default ShareMenu;
