import { ExclamationIcon, ShareIcon, UserIcon } from '@heroicons/react/outline'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

interface MenuProps {
  children: React.ReactNode
  current: boolean
  url: string
}

const Menu: React.FC<MenuProps> = ({ children, current, url }) => (
  <Link href={url} passHref>
    <a
      href={url}
      className={clsx(
        'flex items-center space-x-2 rounded-lg px-3 py-2 hover:bg-brand-100 hover:text-brand-500 dark:hover:bg-opacity-20 dark:bg-opacity-20 hover:bg-opacity-100',
        { 'bg-brand-100 text-brand-500 font-bold': current }
      )}
    >
      {children}
    </a>
  </Link>
)

const Sidebar: React.FC = () => {
  const router = useRouter()

  return (
    <div className="space-y-1.5 mb-4 px-3 sm:px-0">
      <Menu current={router.pathname == '/settings'} url="/settings">
        <UserIcon className="w-4 h-4" />
        <div>Profile</div>
      </Menu>
      <Menu
        current={router.pathname == '/settings/allowance'}
        url="/settings/allowance"
      >
        <ShareIcon className="w-4 h-4" />
        <div>Allowance</div>
      </Menu>
      <Menu
        current={router.pathname == '/settings/delete'}
        url="/settings/delete"
      >
        <ExclamationIcon className="w-4 h-4 text-red-500" />
        <div className="text-red-500">Danger Zone</div>
      </Menu>
    </div>
  )
}

export default Sidebar
