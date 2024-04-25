import type { MirrorablePublication } from '@hey/lens';

import MenuTransition from '@components/Shared/MenuTransition';
import { Menu } from '@headlessui/react';
import { STATIC_IMAGES_URL } from '@hey/data/constants';
import { TipIcon } from '@hey/icons';
import getPublicationTipById from '@hey/lib/getPublicationTipById';
import nFormatter from '@hey/lib/nFormatter';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Tooltip } from '@hey/ui';
import cn from '@hey/ui/cn';
import isFeatureAvailable from '@lib/isFeatureAvailable';
import { motion } from 'framer-motion';
import party from 'party-js';
import { type FC, useRef } from 'react';
import { useTipsStore } from 'src/store/non-persisted/useTipsStore';

import Action from './Action';

interface TipProps {
  publication: MirrorablePublication;
  showCount: boolean;
}

const Tip: FC<TipProps> = ({ publication, showCount }) => {
  const { publicationTips } = useTipsStore();
  const tip = getPublicationTipById(publicationTips, publication.id);
  const confettiDom = useRef<HTMLDivElement>(null);

  if (!isFeatureAvailable('gbp')) {
    return null;
  }

  const triggerConfetti = () => {
    party.resolvableShapes['moneybag'] =
      `<img height="15" width="15" src="${STATIC_IMAGES_URL}/emojis/money-bag.png" />`;
    party.resolvableShapes['moneywithwings'] =
      `<img height="15" width="15" src="${STATIC_IMAGES_URL}/emojis/money-with-wings.png" />`;
    party.resolvableShapes['coin'] =
      `<img height="15" width="15" src="${STATIC_IMAGES_URL}/emojis/coin.png" />`;
    party.sparkles(confettiDom.current as any, {
      count: 20,
      lifetime: 2,
      shapes: ['moneybag', 'moneywithwings', 'coin']
    });
  };

  const iconClassName = showCount
    ? 'w-[17px] sm:w-[20px]'
    : 'w-[15px] sm:w-[18px]';

  return (
    <div className="flex items-center space-x-1">
      <Menu as="div" className="relative">
        <Menu.Button
          aria-label="Tip"
          as={motion.button}
          className={cn(
            tip?.tipped
              ? 'text-brand-500 hover:bg-brand-300/20'
              : 'ld-text-gray-500 hover:bg-gray-300/20',
            'rounded-full p-1.5 outline-offset-2'
          )}
          onClick={stopEventPropagation}
          whileTap={{ scale: 0.9 }}
        >
          <div ref={confettiDom} />
          <Tooltip content="Tip" placement="top" withDelay>
            <TipIcon
              className={cn({ 'text-brand-500': tip?.tipped }, iconClassName)}
            />
          </Tooltip>
        </Menu.Button>
        <MenuTransition>
          <Menu.Items
            className="absolute z-[5] mt-1 w-max rounded-xl border bg-white shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
            static
          >
            <Menu.Item>
              {({ close }) => (
                <Action
                  closePopover={close}
                  publication={publication}
                  triggerConfetti={triggerConfetti}
                />
              )}
            </Menu.Item>
          </Menu.Items>
        </MenuTransition>
      </Menu>
      {(tip?.count || 0) > 0 && !showCount ? (
        <span
          className={cn(
            tip?.tipped ? 'text-brand-500' : 'ld-text-gray-500',
            'text-[11px] sm:text-xs'
          )}
        >
          {nFormatter(tip?.count || 0)}
        </span>
      ) : null}
    </div>
  );
};

export default Tip;
