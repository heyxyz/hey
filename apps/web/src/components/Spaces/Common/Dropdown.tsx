// Radix ui
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import React from 'react';

type DropdownProps = {
  align?: 'center' | 'start' | 'end';
  open?: boolean;
  onOpenChange?(open: boolean): void;
  triggerChild: JSX.Element;
  children: React.ReactNode;
};

const Dropdown: React.FC<DropdownProps> = ({
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
        className="bg-custom-3 relative rounded-xl"
      >
        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
export default Dropdown;
