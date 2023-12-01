import { Menu } from '@headlessui/react';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import type { AnyPublication } from '@hey/lens';
import humanize from '@hey/lib/humanize';
import nFormatter from '@hey/lib/nFormatter';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Spinner, Tooltip } from '@hey/ui';
import cn from '@hey/ui/cn';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { useState } from 'react';

import MenuTransition from '@/components/Shared/MenuTransition';

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
  const hasShared =
    targetPublication.operations.hasMirrored ||
    targetPublication.operations.hasQuoted;
  const shares =
    targetPublication.stats.mirrors + targetPublication.stats.quotes;

  const iconClassName = 'w-[15px] sm:w-[18px]';

  return (
    <div className="flex items-center space-x-1">
      <Menu as="div" className="relative">
        <Menu.Button
          as={motion.button}
          className={cn(
            hasShared
              ? 'text-brand-500 hover:bg-brand-300/20 outline-brand-500'
              : 'ld-text-gray-500 outline-gray-400 hover:bg-gray-300/20',
            'rounded-full p-1.5 outline-offset-2'
          )}
          whileTap={{ scale: 0.9 }}
          onClick={stopEventPropagation}
          aria-label="Mirror"
        >
          {isLoading ? (
            <Spinner
              variant={hasShared ? 'success' : 'primary'}
              size="xs"
              className="mr-0.5"
            />
          ) : (
            <Tooltip
              placement="top"
              content={
                shares > 0
                  ? `${humanize(shares)} Mirrors and Quotes`
                  : 'Mirror or Quote'
              }
              withDelay
            >
              <ArrowsRightLeftIcon className={iconClassName} />
            </Tooltip>
          )}
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
      {shares > 0 && !showCount ? (
        <span
          className={cn(
            hasShared ? 'text-brand-500' : 'ld-text-gray-500',
            'text-[11px] sm:text-xs'
          )}
        >
          {nFormatter(shares)}
        </span>
      ) : null}
    </div>
  );
};

export default ShareMenu;
