import { PencilAltIcon, UsersIcon } from '@heroicons/react/outline';
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

const Sidebar: FC = () => {
  const { query } = useRouter();

  return (
    <div className="sticky px-3 mb-4 space-y-1.5 sm:px-0 top-[128px]">
      <Menu current={query.type == 'pubs'} url={`/search?q=${query.q}&type=pubs`}>
        <PencilAltIcon className="w-4 h-4" />
        <div>Publications</div>
      </Menu>
      <Menu current={query.type == 'profiles'} url={`/search?q=${query.q}&type=profiles`}>
        <UsersIcon className="w-4 h-4" />
        <div>Profiles</div>
      </Menu>
    </div>
  );
};

export default Sidebar;
