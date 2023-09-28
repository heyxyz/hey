import MenuTransition from '@components/Shared/MenuTransition';
import { Menu } from '@headlessui/react';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import type { Publication } from '@hey/lens';
import humanize from '@hey/lib/humanize';
import nFormatter from '@hey/lib/nFormatter';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Spinner, Tooltip } from '@hey/ui';
import cn from '@hey/ui/cn';
import { t } from '@lingui/macro';
import type { FC } from 'react';
import { Fragment, useState } from 'react';

import Mirror from './Mirror';
import Quote from './Quote';

interface PublicationMenuProps {
  publication: Publication;
  showCount: boolean;
}

const ShareMenu: FC<PublicationMenuProps> = ({ publication, showCount }) => {
  const [isLoading, setIsLoading] = useState(false);

  const isMirror = publication.__typename === 'Mirror';
  const count = isMirror
    ? publication?.mirrorOf?.stats?.totalAmountOfMirrors
    : publication?.stats?.totalAmountOfMirrors;
  const mirrored = isMirror
    ? publication?.mirrorOf?.mirrors?.length > 0
    : // @ts-expect-error
      publication?.mirrors?.length > 0;
  const iconClassName = 'w-[15px] sm:w-[18px]';

  return (
    <div className="flex items-center space-x-1">
      <Menu as="div" className="relative">
        <Menu.Button as={Fragment}>
          <button
            className={cn(
              mirrored
                ? 'text-brand hover:bg-brand-300/20'
                : 'lt-text-gray-500 hover:bg-gray-300/20',
              'rounded-full p-1.5'
            )}
            onClick={stopEventPropagation}
            aria-label="Mirror"
          >
            {isLoading ? (
              <Spinner
                variant={mirrored ? 'success' : 'primary'}
                size="xs"
                className="mr-0.5"
              />
            ) : (
              <Tooltip
                placement="top"
                content={count > 0 ? t`${humanize(count)} Mirrors` : t`Mirror`}
                withDelay
              >
                <ArrowsRightLeftIcon className={iconClassName} />
              </Tooltip>
            )}
          </button>
        </Menu.Button>
        <MenuTransition>
          <Menu.Items
            className="absolute z-[5] mt-1 w-max rounded-xl border bg-white shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
            static
          >
            <Mirror
              publication={publication}
              setIsLoading={setIsLoading}
              isLoading={isLoading}
            />
            <Quote publication={publication} />
          </Menu.Items>
        </MenuTransition>
      </Menu>
      {count > 0 && !showCount ? (
        <span
          className={cn(
            mirrored ? 'text-brand' : 'lt-text-gray-500',
            'text-[11px] sm:text-xs'
          )}
        >
          {nFormatter(count)}
        </span>
      ) : null}
    </div>
  );
};

export default ShareMenu;
