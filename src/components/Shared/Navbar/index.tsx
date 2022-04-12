import { gql, useQuery } from '@apollo/client'
import AppContext from '@components/utils/AppContext'
import isStaff from '@lib/isStaff'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useContext } from 'react'

import MenuItems from './MenuItems'
import MoreNavItems from './MoreNavItems'
import Search from './Search'

const StaffBar = dynamic(() => import('./StaffBar'))
const NewPostModal = dynamic(() => import('../../Post/NewPost/Modal'))
const Notification = dynamic(() => import('../../Notification'))

const PING_QUERY = gql`
  query Ping {
    ping
  }
`

const Navbar: FC = () => {
  const { currentUser, staffMode } = useContext(AppContext)
  const { data: indexerData } = useQuery(PING_QUERY, {
    pollInterval: 5000,
    skip: !currentUser
  })

  interface NavItemProps {
    url: string
    name: string
    current: boolean
  }

  const NavItem = ({ url, name, current }: NavItemProps) => {
    return (
      <Link href={url}>
        <a
          href={url}
          className={clsx('px-3 py-1 rounded-md font-black cursor-pointer', {
            'text-black dark:text-white bg-gray-200 dark:bg-gray-800': current,
            'text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800':
              !current
          })}
          aria-current={current ? 'page' : undefined}
        >
          {name}
        </a>
      </Link>
    )
  }

  const NavItems = () => {
    const router = useRouter()

    return (
      <>
        <NavItem url="/" name="Home" current={router.pathname == '/'} />
        <NavItem
          url="/explore"
          name="Explore"
          current={router.pathname == '/explore'}
        />
        <NavItem
          url="/communities"
          name="Communities"
          current={router.pathname == '/communities'}
        />
        <MoreNavItems />
      </>
    )
  }

  return (
    <nav className="sticky top-0 z-10 w-full bg-white border-b dark:bg-gray-900 dark:border-b-gray-700/80">
      {isStaff(currentUser?.id) && staffMode && <StaffBar />}
      <div className="container px-5 mx-auto max-w-screen-xl">
        <div className="flex relative justify-between items-center h-14 sm:h-16">
          <div className="flex flex-1 justify-start items-center">
            <div className="flex flex-shrink-0 items-center space-x-3">
              <Link href="/">
                <a href="/">
                  <div className="text-3xl font-black">
                    <img className="w-8 h-8" src="/logo.svg" alt="Logo" />
                  </div>
                </a>
              </Link>
            </div>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex items-center space-x-4">
                <div className="hidden md:block">
                  <Search />
                </div>
                <NavItems />
              </div>
            </div>
          </div>
          <div className="flex gap-8 items-center">
            {currentUser && <NewPostModal />}
            {currentUser && <Notification />}
            <MenuItems indexerData={indexerData} />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
