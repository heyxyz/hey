import formatAddress from '@hey/lib/formatAddress';
import getProfile from '@hey/lib/getProfile';
import getStampFyiURL from '@hey/lib/getStampFyiURL';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Image } from '@hey/ui';
import getCurrentSession from '@lib/getCurrentSession';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { type FC, useState } from 'react';
import useEnsName from 'src/hooks/useEnsName';
import useProfileStore from 'src/store/persisted/useProfileStore';

import Slug from '../Slug';
import { NextLink } from './MenuItems';
import AppVersion from './NavItems/AppVersion';
import Logout from './NavItems/Logout';
import ThemeSwitch from './NavItems/ThemeSwitch';

const WalletUser: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const [open, setOpen] = useState(false);
  const { id: sessionProfileId } = getCurrentSession();
  const { ens } = useEnsName({
    address: sessionProfileId,
    enabled: Boolean(sessionProfileId)
  });

  const Avatar = () => (
    <Image
      alt={sessionProfileId}
      className="size-8 cursor-pointer rounded-full border dark:border-gray-700"
      src={getStampFyiURL(sessionProfileId)}
    />
  );

  return (
    <DropdownMenu.Root modal={false} onOpenChange={setOpen} open={open}>
      <div className={'md:block'}>
        <DropdownMenu.Trigger asChild>
          <button
            className="outline-brand-500 flex self-center rounded-full"
            onClick={stopEventPropagation}
            type="button"
          >
            <Avatar />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          align={'end'}
          className="menu-transition absolute right-0 mt-2 w-48 rounded-xl border bg-white py-1 shadow-sm focus:outline-none dark:border-gray-700 dark:bg-black"
        >
          <DropdownMenu.Item asChild>
            <NextLink
              className="m-2 flex items-center rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none dark:text-gray-200 dark:hover:bg-gray-800"
              href={getProfile(currentProfile).link}
              onClick={() => setOpen(false)}
            >
              <div className="flex w-full flex-col">
                <div>Logged in as</div>
                <div className="truncate">
                  <Slug className="font-bold" slug={formatAddress(ens)} />
                </div>
              </div>
            </NextLink>
          </DropdownMenu.Item>
          <div className="divider" />
          <DropdownMenu.Item className="m-2 rounded-lg focus:outline-none data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-800">
            <Logout />
          </DropdownMenu.Item>
          <div className="divider" />
          <DropdownMenu.Item className="m-2 rounded-lg focus:outline-none data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-800">
            <ThemeSwitch />
          </DropdownMenu.Item>
          <div className="divider" />
          <AppVersion />
        </DropdownMenu.Content>
      </div>
    </DropdownMenu.Root>
  );
};

export default WalletUser;
