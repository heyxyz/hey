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
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useMirrorOrQuoteOptimisticStore } from 'src/store/OptimisticActions/useMirrorOrQuoteOptimisticStore';

import Mirror from './Mirror';
import Quote from './Quote';

interface PublicationMenuProps {
  publication: AnyPublication;
  showCount: boolean;
}

const ShareMenu: FC<PublicationMenuProps> = ({ publication, showCount }) => {
  const {
    getMirrorOrQuoteCountByPublicationId,
    hasQuotedOrMirroredByMe,
    setMirrorOrQuoteConfig
  } = useMirrorOrQuoteOptimisticStore();
  const [isLoading, setIsLoading] = useState(false);

  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;
  const hasQuotedOrMirrored = hasQuotedOrMirroredByMe(targetPublication.id);
  const mirrorOrQuoteCount = getMirrorOrQuoteCountByPublicationId(
    targetPublication.id
  );

  useEffect(() => {
    setMirrorOrQuoteConfig(targetPublication.id, {
      countMirrorOrQuote:
        targetPublication.stats.mirrors + targetPublication.stats.quotes,
      mirroredOrQuoted:
        targetPublication.operations.hasMirrored ||
        targetPublication.operations.hasQuoted
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publication]);

  const iconClassName = 'w-[15px] sm:w-[18px]';

  return (
    <div className="flex items-center space-x-1">
      <Menu as="div" className="relative">
        <Menu.Button
          as={motion.button}
          className={cn(
            hasQuotedOrMirrored
              ? 'text-brand hover:bg-brand-300/20'
              : 'lt-text-gray-500 hover:bg-gray-300/20',
            'outline-brand-500 rounded-full p-1.5 outline-offset-2'
          )}
          whileTap={{ scale: 0.9 }}
          onClick={stopEventPropagation}
          aria-label="Mirror"
        >
          {isLoading ? (
            <Spinner
              variant={hasQuotedOrMirrored ? 'success' : 'primary'}
              size="xs"
              className="mr-0.5"
            />
          ) : (
            <Tooltip
              placement="top"
              content={
                mirrorOrQuoteCount > 0
                  ? `${humanize(mirrorOrQuoteCount)} Mirrors`
                  : 'Mirror'
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
      {mirrorOrQuoteCount > 0 && !showCount ? (
        <span
          className={cn(
            hasQuotedOrMirrored ? 'text-brand' : 'lt-text-gray-500',
            'text-[11px] sm:text-xs'
          )}
        >
          {nFormatter(mirrorOrQuoteCount)}
        </span>
      ) : null}
    </div>
  );
};

export default ShareMenu;
