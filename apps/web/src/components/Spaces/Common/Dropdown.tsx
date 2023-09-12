import { Menu } from '@headlessui/react';
import type { FC, ReactNode } from 'react';
import React from 'react';

interface DropdownProps {
  triggerChild: JSX.Element;
  children: ReactNode;
}

const Dropdown: FC<DropdownProps> = ({ children, triggerChild }) => {
  return (
    <Menu>
      <Menu.Button>{triggerChild}</Menu.Button>
      <Menu.Items className="absolute z-10">
        <Menu.Item disabled>{children}</Menu.Item>
      </Menu.Items>
    </Menu>
  );
};
export default Dropdown;
