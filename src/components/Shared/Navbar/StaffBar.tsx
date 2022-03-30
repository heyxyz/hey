import { Menu, Transition } from '@headlessui/react'
import {
  ChartPieIcon,
  GlobeAltIcon,
  HashtagIcon,
  TerminalIcon
} from '@heroicons/react/outline'
import React, { Fragment } from 'react'
import { GIT_COMMIT_REF, GIT_COMMIT_SHA, IS_PRODUCTION } from 'src/constants'

import Stats from './Stats'

interface Props {
  children: React.ReactNode
}

const Badge: React.FC<Props> = ({ children }) => (
  <span className="py-0.5 px-1.5 text-xs font-bold bg-gray-300 rounded-md dark:bg-gray-900">
    {children}
  </span>
)

const StaffBar: React.FC = () => {
  return (
    <div className="flex justify-between px-3 py-1 text-sm bg-gray-200 dark:bg-black">
      <div className="flex items-center space-x-2">
        {IS_PRODUCTION ? (
          <div className="flex items-center space-x-1" title="Git commit ref">
            <GlobeAltIcon className="w-4 h-4 text-green-500" />
            <Badge>Prod</Badge>
          </div>
        ) : (
          <div className="flex items-center space-x-1" title="Git commit ref">
            <GlobeAltIcon className="w-4 h-4 text-yellow-500" />
            <Badge>Dev</Badge>
          </div>
        )}
        {GIT_COMMIT_REF && (
          <div className="flex items-center space-x-1" title="Git commit ref">
            <TerminalIcon className="w-4 h-4" />
            <Badge>{GIT_COMMIT_REF}</Badge>
          </div>
        )}
        {GIT_COMMIT_SHA && (
          <div className="flex items-center space-x-1" title="Git commit SHA">
            <HashtagIcon className="w-4 h-4" />
            <Badge>{GIT_COMMIT_SHA}</Badge>
          </div>
        )}
      </div>
      <Menu>
        {({ open }) => (
          <>
            <Menu.Button as="button">
              <ChartPieIcon className="w-4 h-4" />
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
                className="absolute z-10 py-1 mt-6 origin-top-right bg-white border shadow-sm right-2 w-52 rounded-xl dark:bg-gray-900 dark:border-gray-800 focus:outline-none"
              >
                <Stats />
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  )
}

export default StaffBar
