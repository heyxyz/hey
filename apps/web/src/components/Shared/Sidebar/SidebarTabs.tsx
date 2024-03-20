import type { FC, ReactNode } from 'react';

import cn from '@hey/ui/cn';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface MenuProps {
  children: ReactNode;
  current: boolean;
  url: string;
}

const Menu: FC<MenuProps> = ({ children, current, url }) => (
  <Link
    className={cn(
      { 'font-bold text-black dark:text-white': current },
      { 'bg-gray-300 dark:bg-gray-300/20': current },
      'hover:bg-gray-300 dark:hover:bg-gray-300/30',
      'hover:text-black hover:dark:text-white',
      'flex items-center space-x-2 rounded-lg px-3 py-2'
    )}
    href={url}
  >
    {children}
  </Link>
);

interface SidebarTabsProps {
  items: {
    active?: boolean;
    enabled?: boolean;
    icon: ReactNode;
    title: ReactNode;
    url: string;
  }[];
}

const SidebarTabs: FC<SidebarTabsProps> = ({ items }) => {
  const { pathname } = useRouter();
  const menuItems = items.map((item) => ({
    ...item,
    enabled: item.enabled || true
  }));

  return (
    <div className="mb-4 space-y-2 px-3 sm:px-0">
      {menuItems.map((item: any) =>
        item?.enabled ? (
          <Menu
            current={pathname === item.url || item.active}
            key={item.title}
            url={item.url}
          >
            {item.icon}
            <div>{item.title}</div>
          </Menu>
        ) : null
      )}
    </div>
  );
};

export default SidebarTabs;
