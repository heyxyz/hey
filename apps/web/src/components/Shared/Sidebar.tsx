import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC, ReactNode } from 'react';

interface MenuProps {
  children: ReactNode;
  current: boolean;
  url: string;
}

const Menu: FC<MenuProps> = ({ children, current, url }) => (
  <Link
    href={url}
    className={clsx(
      'flex items-center space-x-2 rounded-lg px-3 py-2 hover:bg-brand-100 hover:text-brand dark:hover:bg-opacity-20 dark:bg-opacity-20 hover:bg-opacity-100',
      { 'bg-brand-100 text-brand font-bold': current }
    )}
  >
    {children}
  </Link>
);

interface Props {
  items: {
    title: ReactNode;
    icon: ReactNode;
    url: string;
    enabled?: boolean;
  }[];
}

const Sidebar: FC<Props> = ({ items }) => {
  const { pathname } = useRouter();
  const menuItems = items.map((item) => ({ ...item, enabled: item.enabled ?? true }));

  return (
    <div className="px-3 mb-4 space-y-1.5 sm:px-0">
      {menuItems.map((item: any, index: number) =>
        item?.enabled ? (
          <Menu key={index} current={pathname == item.url} url={item.url}>
            {item.icon}
            <div>{item.title}</div>
          </Menu>
        ) : null
      )}
    </div>
  );
};

export default Sidebar;
