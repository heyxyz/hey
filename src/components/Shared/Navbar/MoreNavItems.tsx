import AppContext from '@components/utils/AppContext'
import { Menu, Transition } from '@headlessui/react'
import {
  CashIcon,
  SupportIcon,
  UserIcon,
  UsersIcon
} from '@heroicons/react/outline'
import clsx from 'clsx'
import { Fragment, useContext } from 'react'

import { NextLink } from './MenuItems'

const MoreNavItems: React.FC = () => {
  const { currentUser } = useContext(AppContext)

  return (
    <Menu as="div">
      {({ open }) => (
        <>
          <Menu.Button
            className={clsx('px-3 py-1 rounded-md font-black cursor-pointer', {
              'text-black dark:text-white bg-gray-200 dark:bg-gray-800': open,
              'text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800':
                !open
            })}
          >
            More
          </Menu.Button>
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
              className="absolute py-1 mt-2 w-52 bg-white rounded-lg border shadow-sm dark:bg-gray-900 dark:border-gray-800"
            >
              {currentUser && (
                <>
                  <Menu.Item
                    as={NextLink}
                    href="/communities/create"
                    className={({ active }: { active: boolean }) =>
                      clsx(
                        { 'bg-gray-100 dark:bg-gray-800': active },
                        'block px-4 py-1.5 text-sm text-gray-700 dark:text-gray-200 m-2 rounded-lg cursor-pointer'
                      )
                    }
                  >
                    <div className="flex items-center space-x-1.5">
                      <UsersIcon className="w-4 h-4" />
                      <div>Create Community</div>
                    </div>
                  </Menu.Item>
                  <Menu.Item
                    as={NextLink}
                    href="/crowdfunds/create"
                    className={({ active }: { active: boolean }) =>
                      clsx(
                        { 'bg-gray-100 dark:bg-gray-800': active },
                        'block px-4 py-1.5 text-sm text-gray-700 dark:text-gray-200 m-2 rounded-lg cursor-pointer'
                      )
                    }
                  >
                    <div className="flex items-center space-x-1.5">
                      <CashIcon className="w-4 h-4" />
                      <div>Create Crowdfund</div>
                    </div>
                  </Menu.Item>
                  <Menu.Item
                    as={NextLink}
                    href="/create"
                    className={({ active }: { active: boolean }) =>
                      clsx(
                        { 'bg-gray-100 dark:bg-gray-800': active },
                        'block px-4 py-1.5 text-sm text-gray-700 dark:text-gray-200 m-2 rounded-lg cursor-pointer'
                      )
                    }
                  >
                    <div className="flex items-center space-x-1.5">
                      <UserIcon className="w-4 h-4" />
                      <div>Create Profile</div>
                    </div>
                  </Menu.Item>
                  <div className="border-b dark:border-gray-800" />
                </>
              )}
              <Menu.Item
                as="a"
                href="https://discord.gg/n8VXKgevbw"
                target="_blank"
                className={({ active }: { active: boolean }) =>
                  clsx(
                    { 'bg-gray-100 dark:bg-gray-800': active },
                    'block px-4 py-1.5 text-sm text-gray-700 dark:text-gray-200 m-2 rounded-lg cursor-pointer'
                  )
                }
              >
                <div className="flex items-center space-x-1.5">
                  <SupportIcon className="w-4 h-4" />
                  <div>Contact</div>
                </div>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  )
}

export default MoreNavItems
