import { Card } from '@hey/ui';
import cn from '@hey/ui/cn';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useRouter } from 'next/router';
import { type FC, type ReactNode, useState } from 'react';

import { NextLink } from '../Navbar/MenuItems';

interface SidebarProps {
  items: {
    active?: boolean;
    enabled?: boolean;
    icon: ReactNode;
    title: ReactNode;
    url: string;
  }[];
}

const SidebarMenu: FC<SidebarProps> = ({ items }) => {
  const { pathname } = useRouter();
  const menuItems = items.map((item) => ({
    ...item,
    enabled: item.enabled || true
  }));
  const [selectedItem, setSelectedItem] = useState(
    menuItems.find((item) => item.url === pathname) || menuItems[0]
  );
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4 space-y-2">
      <DropdownMenu.Root modal={false} onOpenChange={setOpen} open={open}>
        <DropdownMenu.Trigger asChild>
          <button
            className={cn(
              'focus:border-brand-500 focus:ring-brand-400 flex w-full items-center space-x-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-left outline-none dark:border-gray-700 dark:bg-gray-800',
              {
                'bg-gray-200 text-black dark:bg-gray-800 dark:text-white': open,
                'text-gray-700 hover:bg-gray-200 hover:text-black dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white':
                  !open
              }
            )}
          >
            {selectedItem.icon}
            <div>{selectedItem.title}</div>
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="menu-transition absolute z-10 mt-2 w-full">
          <Card forceRounded>
            {menuItems.map((item) => (
              <DropdownMenu.Item
                key={item.url}
                onSelect={() => setSelectedItem(item)}
              >
                <NextLink
                  className={({ active }: { active: boolean }) =>
                    cn(
                      {
                        'dropdown-active': active || selectedItem === item
                      },
                      'm-2 flex items-center space-x-2 rounded-lg p-2'
                    )
                  }
                  href={item.url}
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  {item.icon}
                  <div>{item.title}</div>
                </NextLink>
              </DropdownMenu.Item>
            ))}
          </Card>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
};

export default SidebarMenu;
