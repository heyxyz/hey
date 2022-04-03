import { Menu, Transition } from '@headlessui/react'
import { LightningBoltIcon } from '@heroicons/react/outline'
import { trackEvent } from '@lib/trackEvent'
import { Fragment } from 'react'

import List from './List'

const Notification: React.FC = () => {
  return (
    <Menu as="span" className="sm:relative mt-1.5">
      {({ open }) => (
        <>
          <Menu.Button>
            <button
              onClick={() =>
                trackEvent(`notifications ${open ? 'open' : 'close'}`)
              }
            >
              <LightningBoltIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
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
            <Menu.Items className="overflow-y-auto max-h-[80vh] sm:max-h-[60vh] absolute right-0 mt-1 min-w-full sm:min-w-[28rem] bg-white rounded-xl border shadow-sm dark:bg-gray-900 dark:border-gray-800">
              <List />
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  )
}

export default Notification
