import { XMarkIcon } from '@heroicons/react/24/outline';
import * as Popover from '@radix-ui/react-popover';
import React from 'react';

const HeyPopover = ({
  arrow,
  children,
  close,
  content
}: {
  arrow?: boolean;
  children: React.ReactNode;
  close?: boolean;
  content: React.ReactNode;
}) => (
  <Popover.Root>
    <Popover.Trigger asChild>{content}</Popover.Trigger>
    <Popover.Portal>
      <Popover.Content className="PopoverContent" sideOffset={5}>
        {children}
        {close && (
          <Popover.Close aria-label="Close" className="PopoverClose">
            <XMarkIcon />
          </Popover.Close>
        )}
        {arrow && <Popover.Arrow className="PopoverArrow" />}
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
);

export { HeyPopover };
