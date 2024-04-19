import MenuTransition from '@components/Shared/MenuTransition';
import { Menu } from '@headlessui/react';
import { TipIcon } from '@hey/icons';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Tooltip } from '@hey/ui';
import isFeatureAvailable from '@lib/isFeatureAvailable';
import { motion } from 'framer-motion';
import party from 'party-js';
import { type FC, useRef } from 'react';

import Action from './Action';

const Tip: FC = () => {
  const confettiDom = useRef<HTMLDivElement>(null);

  if (!isFeatureAvailable('gbp')) {
    return null;
  }

  const triggerConfetti = () => {
    party.resolvableShapes['moneybag'] = '<span>💰</span>';
    party.sparkles(confettiDom.current as any, {
      lifetime: 2,
      shapes: ['moneybag']
    });
  };

  const iconClassName = 'w-[15px] sm:w-[18px]';

  return (
    <Menu as="div" className="relative">
      <Menu.Button
        aria-label="Tip"
        as={motion.button}
        className="ld-text-gray-500 rounded-full p-1.5 outline-offset-2 hover:bg-gray-300/20"
        onClick={stopEventPropagation}
        whileTap={{ scale: 0.9 }}
      >
        <div ref={confettiDom} />
        <Tooltip content="Tip" placement="top" withDelay>
          <TipIcon className={iconClassName} />
        </Tooltip>
      </Menu.Button>
      <MenuTransition>
        <Menu.Items
          className="absolute z-[5] mt-1 w-max rounded-xl border bg-white shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
          static
        >
          <Menu.Item>
            {({ close }) => (
              <Action closePopover={close} triggerConfetti={triggerConfetti} />
            )}
          </Menu.Item>
        </Menu.Items>
      </MenuTransition>
    </Menu>
  );
};

export default Tip;
