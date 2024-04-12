import type { AnyPublication } from '@hey/lens';

import MenuTransition from '@components/Shared/MenuTransition';
import { Popover } from '@headlessui/react';
import { TipIcon } from '@hey/icons';
import humanize from '@hey/lib/humanize';
import nFormatter from '@hey/lib/nFormatter';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Tooltip } from '@hey/ui';
import { motion } from 'framer-motion';
import party from 'party-js';
import { type FC, useRef } from 'react';

import Action from './Action';

interface TipProps {
  publication: AnyPublication;
  showCount: boolean;
  tips: number;
}

const Tip: FC<TipProps> = ({ publication, showCount, tips }) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;
  const confettiDom = useRef<HTMLDivElement>(null);

  const triggerConfetti = () => {
    party.resolvableShapes['moneybag'] = '<span>💰</span>';
    party.sparkles(confettiDom.current as any, {
      lifetime: 2,
      shapes: ['moneybag']
    });
  };

  const iconClassName = 'w-[15px] sm:w-[18px]';

  return (
    <div className="flex items-center space-x-1">
      <Popover as="div" className="relative">
        <Popover.Button
          aria-label="Tip"
          as={motion.button}
          className="ld-text-gray-500 rounded-full p-1.5 outline-offset-2 hover:bg-gray-300/20"
          onClick={stopEventPropagation}
          whileTap={{ scale: 0.9 }}
        >
          <div ref={confettiDom} />
          <Tooltip
            content={tips > 0 ? `${humanize(tips)} Tips` : 'Tip'}
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
                closePopover={close}
                publication={targetPublication}
                triggerConfetti={triggerConfetti}
              />
            )}
          </Popover.Panel>
        </MenuTransition>
      </Popover>
      {tips > 0 && !showCount ? (
        <span className="ld-text-gray-500 text-[11px] sm:text-xs">
          {nFormatter(tips)}
        </span>
      ) : null}
    </div>
  );
};

export default Tip;
