import { PencilAltIcon, UsersIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
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
      'hover:bg-brand-100 hover:text-brand flex items-center space-x-2 rounded-lg px-3 py-2 hover:bg-opacity-100 dark:bg-opacity-20 dark:hover:bg-opacity-20',
      { 'bg-brand-100 text-brand font-bold': current }
    )}
  >
    {children}
  </Link>
);

const Sidebar: FC = () => {
  const { query } = useRouter();

  return (
    <div className="sticky top-[128px] mb-4 space-y-1.5 px-3 sm:px-0">
      <Menu current={query.type == 'pubs'} url={`/search?q=${query.q}&type=pubs`}>
        <PencilAltIcon className="h-4 w-4" />
        <div>
          <Trans>Publications</Trans>
        </div>
      </Menu>
      <Menu current={query.type == 'profiles'} url={`/search?q=${query.q}&type=profiles`}>
        <UsersIcon className="h-4 w-4" />
        <div>
          <Trans>Profiles</Trans>
        </div>
      </Menu>
    </div>
  );
};

export default Sidebar;
