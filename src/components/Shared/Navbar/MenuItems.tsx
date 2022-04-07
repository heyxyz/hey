import { Button } from '@components/UI/Button'
import { Modal } from '@components/UI/Modal'
import AppContext from '@components/utils/AppContext'
import { Profile } from '@generated/types'
import { Menu, Transition } from '@headlessui/react'
import {
  ArrowCircleRightIcon,
  CogIcon,
  LogoutIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  SwitchHorizontalIcon,
  UserIcon
} from '@heroicons/react/outline'
import { CheckCircleIcon } from '@heroicons/react/solid'
import { getAvatar } from '@lib/getAvatar'
import { isStaff } from '@lib/isStaff'
import { trackEvent } from '@lib/trackEvent'
import clsx from 'clsx'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Fragment, useContext, useState } from 'react'
import { useAccount, useNetwork } from 'wagmi'

import Slug from '../Slug'
import SwitchNetwork from '../SwitchNetwork'
import Login from './Login'

export const NextLink = ({ href, children, ...rest }: Record<string, any>) => (
  <Link href={href} passHref>
    <a {...rest}>{children}</a>
  </Link>
)

interface Props {
  indexerData: {
    ping: string
  }
}

const MenuItems: React.FC<Props> = ({ indexerData }) => {
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false)
  const { theme, setTheme } = useTheme()
  const [{ data: network }, switchNetwork] = useNetwork()
  const [{}, disconnect] = useAccount()
  const {
    staffMode,
    setStaffMode,
    profiles,
    currentUser,
    currentUserLoading,
    setSelectedProfile
  } = useContext(AppContext)

  const toggleStaffMode = () => {
    localStorage.setItem('staffMode', String(!staffMode))
    setStaffMode(!staffMode)
  }

  return (
    <>
      {currentUserLoading ? (
        <div className="w-8 h-8 rounded-full shimmer" />
      ) : currentUser && !network.chain?.unsupported ? (
        <Menu as="div">
          {({ open }) => (
            <>
              <Menu.Button
                as="img"
                src={getAvatar(currentUser)}
                className="w-8 h-8 rounded-full border cursor-pointer dark:border-gray-700"
                alt={currentUser.handle}
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
                  className="absolute right-0 py-1 mt-2 w-48 bg-white rounded-xl border shadow-sm origin-top-right dark:bg-gray-900 dark:border-gray-800 focus:outline-none"
                >
                  <Menu.Item
                    as={NextLink}
                    href={`/u/${currentUser.handle}`}
                    className={({ active }: { active: boolean }) =>
                      clsx(
                        { 'bg-gray-100 dark:bg-gray-800': active },
                        'block px-4 py-1.5 text-sm text-gray-700 dark:text-gray-200 m-2 cursor-pointer space-y-1 rounded-lg'
                      )
                    }
                  >
                    <div>Logged in as</div>
                    <div className="truncate">
                      <Slug
                        className="font-bold"
                        slug={currentUser.handle}
                        prefix="@"
                      />
                    </div>
                  </Menu.Item>
                  <div className="border-b dark:border-gray-800" />
                  <Menu.Item
                    as={NextLink}
                    href={`/u/${currentUser.handle}`}
                    className={({ active }: { active: boolean }) =>
                      clsx(
                        { 'bg-gray-100 dark:bg-gray-800': active },
                        'block px-4 py-1.5 text-sm text-gray-700 dark:text-gray-200 m-2 cursor-pointer rounded-lg'
                      )
                    }
                  >
                    <div className="flex items-center space-x-1.5">
                      <UserIcon className="w-4 h-4" />
                      <div>Your Profile</div>
                    </div>
                  </Menu.Item>
                  <Menu.Item
                    as={NextLink}
                    href="/settings"
                    className={({ active }: { active: boolean }) =>
                      clsx(
                        { 'bg-gray-100 dark:bg-gray-800': active },
                        'block px-4 py-1.5 text-sm text-gray-700 dark:text-gray-200 m-2 cursor-pointer rounded-lg'
                      )
                    }
                  >
                    <div className="flex items-center space-x-1.5">
                      <CogIcon className="w-4 h-4" />
                      <div>Settings</div>
                    </div>
                  </Menu.Item>
                  <Menu.Item
                    as="a"
                    onClick={() => {
                      trackEvent('logout')
                      localStorage.removeItem('selectedProfile')
                      localStorage.removeItem('accessToken')
                      localStorage.removeItem('refreshToken')
                      disconnect()
                      location.href = '/'
                    }}
                    className={({ active }: { active: boolean }) =>
                      clsx(
                        { 'bg-gray-100 dark:bg-gray-800': active },
                        'block px-4 py-1.5 text-sm text-gray-700 dark:text-gray-200 m-2 cursor-pointer rounded-lg'
                      )
                    }
                  >
                    <div className="flex items-center space-x-1.5">
                      <LogoutIcon className="w-4 h-4" />
                      <div>Logout</div>
                    </div>
                  </Menu.Item>
                  {profiles.length > 1 && (
                    <>
                      <div className="border-b dark:border-gray-800" />
                      <div className="overflow-auto m-2 max-h-36 no-scrollbar">
                        <div className="flex items-center px-4 pt-1 pb-2 space-x-1.5 text-sm font-bold text-gray-500">
                          <SwitchHorizontalIcon className="w-4 h-4" />
                          <div>Switch to</div>
                        </div>
                        {profiles.map((profile: Profile, index: number) => (
                          <div
                            key={profile.id}
                            className="block text-sm text-gray-700 rounded-lg cursor-pointer dark:text-gray-200"
                          >
                            <button
                              className="flex items-center py-1.5 px-4 space-x-2 w-full rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                              onClick={() => {
                                localStorage.setItem(
                                  'selectedProfile',
                                  index.toString()
                                )
                                setSelectedProfile(index)
                                trackEvent('switch profile')
                              }}
                            >
                              {currentUser.id === profile.id && (
                                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                              )}
                              <img
                                className="w-5 h-5 rounded-full border dark:border-gray-700"
                                src={getAvatar(profile)}
                                alt={profile.handle}
                              />
                              <div className="truncate">{profile.handle}</div>
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  <div className="border-b dark:border-gray-800" />
                  <div className="flex items-center py-3 px-5 space-x-4">
                    <button
                      onClick={() => {
                        trackEvent('light mode')
                        setTheme('light')
                      }}
                      className={theme === 'light' ? 'text-xl' : ''}
                    >
                      🌞
                    </button>
                    <button
                      onClick={() => {
                        trackEvent('dark mode')
                        setTheme('dark')
                      }}
                      className={theme === 'dark' ? 'text-xl' : ''}
                    >
                      🌚
                    </button>
                    <button
                      onClick={() => {
                        trackEvent('system theme mode')
                        setTheme('system')
                      }}
                      className={theme === 'system' ? 'text-xl' : ''}
                    >
                      💻
                    </button>
                  </div>
                  {isStaff(currentUser.id) && (
                    <>
                      <div className="border-b dark:border-gray-800" />
                      <Menu.Item
                        as="div"
                        onClick={toggleStaffMode}
                        className={({ active }: { active: boolean }) =>
                          clsx(
                            { 'bg-yellow-100 dark:bg-yellow-800': active },
                            'block px-4 py-1.5 text-sm text-gray-700 dark:text-gray-200 m-2 rounded-lg cursor-pointer'
                          )
                        }
                      >
                        {staffMode ? (
                          <div className="flex items-center space-x-1.5">
                            <div>Disable staff mode</div>
                            <ShieldExclamationIcon className="w-4 h-4 text-green-600" />
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1.5">
                            <div>Enable staff mode</div>
                            <ShieldCheckIcon className="w-4 h-4 text-red-500" />
                          </div>
                        )}
                      </Menu.Item>
                    </>
                  )}
                  {indexerData && (
                    <>
                      <div className="border-b dark:border-gray-800" />
                      <div className="flex items-center py-3 px-6 space-x-2.5 text-sm">
                        <div
                          className={clsx(
                            { 'bg-green-500': indexerData?.ping === 'pong' },
                            { 'bg-red-500': indexerData?.ping !== 'pong' },
                            'p-[4.5px] rounded-full animate-pulse'
                          )}
                        />
                        <div>
                          {indexerData?.ping === 'pong'
                            ? 'Indexer active'
                            : 'Indexer inactive'}
                        </div>
                      </div>
                    </>
                  )}
                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>
      ) : network.chain?.unsupported && switchNetwork ? (
        <SwitchNetwork />
      ) : (
        <>
          <Modal
            title="Login"
            icon={<ArrowCircleRightIcon className="w-5 h-5 text-brand-500" />}
            show={showLoginModal}
            onClose={() => setShowLoginModal(!showLoginModal)}
          >
            <Login />
          </Modal>
          <Button
            icon={
              <img
                className="mr-0.5 h-4"
                src="/eth-white.svg"
                alt="Ethereum Logo"
              />
            }
            onClick={() => {
              trackEvent('login')
              setShowLoginModal(!showLoginModal)
            }}
          >
            Login
          </Button>
        </>
      )}
    </>
  )
}

export default MenuItems
