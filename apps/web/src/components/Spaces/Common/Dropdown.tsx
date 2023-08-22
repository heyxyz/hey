// Radix ui
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import type { FC } from 'react';
import React from 'react';

type DropdownProps = {
  align?: 'center' | 'start' | 'end';
  open?: boolean;
  onOpenChange?(open: boolean): void;
  triggerChild: JSX.Element;
  children: React.ReactNode;
};

const Dropdown: FC<DropdownProps> = ({
  children,
  triggerChild,
  onOpenChange,
  open,
  align
}) => {
  return (
    <DropdownMenu.Root open={open} onOpenChange={onOpenChange}>
      <DropdownMenu.Trigger asChild>
        <span>{triggerChild}</span>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        sideOffset={5}
        align={align}
        className="relative left-1/2 z-50 mr-8 -translate-x-1/2 transform"
      >
        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
export default Dropdown;
