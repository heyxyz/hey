import { Menu, Transition } from '@headlessui/react';
import { LogoutIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import clsx from 'clsx';
import Cookies from 'js-cookie';
import { FC, Fragment } from 'react';
import { USER } from 'src/tracking';
import { useAccount, useDisconnect } from 'wagmi';

const UnsignedUser: FC = () => {
  const { disconnect } = useDisconnect();
  const { address } = useAccount();

  return (
    <Menu as="div">
      {({ open }) => (
        <>
          <Menu.Button
            as="img"
            src={`https://cdn.stamp.fyi/avatar/eth:${address}?s=138`}
            className="w-8 h-8 rounded-full border cursor-pointer dark:border-gray-700/80"
            alt={`${address}'s avatar`}
          />
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              static
              className="absolute right-0 py-1 mt-2 w-48 bg-white rounded-xl border shadow-sm dark:bg-gray-900 focus:outline-none dark:border-gray-700/80"
            >
              <Menu.Item
                as="a"
                onClick={() => {
                  Mixpanel.track(USER.LOGOUT);
                  Cookies.remove('accessToken');
                  Cookies.remove('refreshToken');
                  localStorage.removeItem('lenster.store');
                  if (disconnect) {
                    disconnect();
                  }
                }}
                className={({ active }: { active: boolean }) =>
                  clsx({ 'dropdown-active': active }, 'menu-item')
                }
              >
                <div className="flex items-center space-x-1.5">
                  <LogoutIcon className="w-4 h-4" />
                  <div>Logout</div>
                </div>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default UnsignedUser;
