import MenuTransition from '@components/Shared/MenuTransition';
import { Menu } from '@headlessui/react';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import type { AnyPublication } from '@hey/lens';
import humanize from '@hey/lib/humanize';
import nFormatter from '@hey/lib/nFormatter';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Spinner, Tooltip } from '@hey/ui';
import cn from '@hey/ui/cn';
import type { FC } from 'react';
import { Fragment, useState } from 'react';

import Mirror from './Mirror';
import Quote from './Quote';

interface PublicationMenuProps {
  publication: AnyPublication;
  showCount: boolean;
}

const ShareMenu: FC<PublicationMenuProps> = ({ publication, showCount }) => {
  const [isLoading, setIsLoading] = useState(false);

  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;

  const count =
    targetPublication.stats.mirrors + targetPublication.stats.quotes;
  const mirrored = targetPublication.operations.hasMirrored;
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
                content={count > 0 ? `${humanize(count)} Mirrors` : 'Mirror'}
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
