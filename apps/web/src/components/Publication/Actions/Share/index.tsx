import type { AnyPublication } from '@good/lens';
import type { FC } from 'react';

import MenuTransition from '@components/Shared/MenuTransition';
import humanize from '@good/helpers/humanize';
import nFormatter from '@good/helpers/nFormatter';
import { isMirrorPublication } from '@good/helpers/publicationHelpers';
import stopEventPropagation from '@good/helpers/stopEventPropagation';
import { Spinner, Tooltip } from '@good/ui';
import cn from '@good/ui/cn';
import { Menu, MenuButton, MenuItems } from '@headlessui/react';
import hasOptimisticallyMirrored from '@helpers/optimistic/hasOptimisticallyMirrored';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useState } from 'react';

import Mirror from './Mirror';
import Quote from './Quote';
import UndoMirror from './UndoMirror';

interface ShareMenuProps {
  publication: AnyPublication;
  showCount: boolean;
}

const ShareMenu: FC<ShareMenuProps> = ({ publication, showCount }) => {
  const [isLoading, setIsLoading] = useState(false);
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;
  const hasShared =
    targetPublication.operations.hasMirrored ||
    targetPublication.operations.hasQuoted ||
    hasOptimisticallyMirrored(publication.id);
  const shares =
    targetPublication.stats.mirrors + targetPublication.stats.quotes;

  const iconClassName = 'w-[15px] sm:w-[18px]';

  return (
    <div className="flex items-center space-x-1">
      <Menu as="div" className="relative">
        <MenuButton
          aria-label="Mirror"
          as={motion.button}
          className={cn(
            hasShared
              ? 'text-brand-500 hover:bg-brand-300/20'
              : 'ld-text-gray-500 hover:bg-gray-300/20',
            'rounded-full p-1.5 outline-offset-2'
          )}
          onClick={stopEventPropagation}
          whileTap={{ scale: 0.9 }}
        >
          {isLoading ? (
            <Spinner
              className="mr-0.5"
              size="xs"
              variant={hasShared ? 'danger' : 'primary'}
            />
          ) : (
            <Tooltip
              content={
                shares > 0
                  ? `${humanize(shares)} Mirrors and Quotes`
                  : 'Mirror or Quote'
              }
              placement="top"
              withDelay
            >
              <ArrowsRightLeftIcon className={iconClassName} />
            </Tooltip>
          )}
        </MenuButton>
        <MenuTransition>
          <MenuItems
            className="absolute z-[5] mt-1 w-max rounded-xl border bg-white shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
            static
          >
            <Mirror
              isLoading={isLoading}
              publication={targetPublication}
              setIsLoading={setIsLoading}
            />
            {targetPublication.operations.hasMirrored &&
              targetPublication.id !== publication.id && (
                <UndoMirror
                  isLoading={isLoading}
                  publication={publication}
                  setIsLoading={setIsLoading}
                />
              )}
            <Quote publication={targetPublication} />
          </MenuItems>
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
