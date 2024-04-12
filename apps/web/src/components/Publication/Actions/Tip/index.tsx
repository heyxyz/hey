import type { AnyPublication } from '@hey/lens';

import MenuTransition from '@components/Shared/MenuTransition';
import { Popover } from '@headlessui/react';
import { TipIcon } from '@hey/icons';
import humanize from '@hey/lib/humanize';
import nFormatter from '@hey/lib/nFormatter';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Tooltip } from '@hey/ui';
import cn from '@hey/ui/cn';
import hasOptimisticallyMirrored from '@lib/optimistic/hasOptimisticallyMirrored';
import { motion } from 'framer-motion';
import party from 'party-js';
import { type FC, useRef } from 'react';

import Action from './Action';

interface TipProps {
  publication: AnyPublication;
  showCount: boolean;
}

const Tip: FC<TipProps> = ({ publication, showCount }) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;
  const hasShared =
    targetPublication.operations.hasMirrored ||
    targetPublication.operations.hasQuoted ||
    hasOptimisticallyMirrored(targetPublication.id);
  const shares =
    targetPublication.stats.mirrors + targetPublication.stats.quotes;
  const confettiDom = useRef<HTMLDivElement>(null);

  const iconClassName = 'w-[15px] sm:w-[18px]';

  const triggerConfetti = () => {
    party.resolvableShapes['moneybag'] = '<span>💰</span>';
    party.sparkles(confettiDom.current as any, {
      lifetime: 2,
      shapes: ['moneybag']
    });
  };

  return (
    <div className="flex items-center space-x-1">
      <Popover as="div" className="relative">
        <Popover.Button
          aria-label="Tip"
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
          <div ref={confettiDom} />
          <Tooltip
            content={shares > 0 ? `${humanize(shares)} Tips` : 'Tip'}
            placement="top"
            withDelay
          >
            <TipIcon className={iconClassName} />
          </Tooltip>
        </Popover.Button>
        <MenuTransition>
          <Popover.Panel
            className="absolute z-[5] mt-1 w-max rounded-xl border bg-white shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
            static
          >
            {({ close }) => (
              <Action
                publication={targetPublication}
                triggerConfetti={() => {
                  triggerConfetti();
                  close();
                }}
              />
            )}
          </Popover.Panel>
        </MenuTransition>
      </Popover>
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

export default Tip;
