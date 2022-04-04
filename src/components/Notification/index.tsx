import { gql, useQuery } from '@apollo/client'
import AppContext from '@components/utils/AppContext'
import { Menu, Transition } from '@headlessui/react'
import { LightningBoltIcon } from '@heroicons/react/outline'
import { trackEvent } from '@lib/trackEvent'
import { Fragment, useContext, useEffect, useState } from 'react'

import List from './List'

const NOTIFICATION_COUNT_QUERY = gql`
  query NotificationCount($request: NotificationRequest!) {
    notifications(request: $request) {
      pageInfo {
        totalCount
      }
    }
  }
`

const Notification: React.FC = () => {
  const { currentUser } = useContext(AppContext)
  const [showBadge, setShowBadge] = useState<boolean>(false)
  const { data } = useQuery(NOTIFICATION_COUNT_QUERY, {
    variables: { request: { profileId: currentUser?.id } },
    skip: !currentUser?.id
  })

  useEffect(() => {
    if (currentUser && data) {
      const localCount = localStorage.getItem('notificationCount') ?? '0'
      const currentCount = data?.notifications?.pageInfo?.totalCount.toString()
      setShowBadge(localCount !== currentCount)
    }
  }, [currentUser, data])

  return (
    <Menu as="div" className="mt-1.5 sm:relative">
      {({ open }) => (
        <>
          <Menu.Button>
            <button
              className="flex items-start"
              onClick={() => {
                trackEvent(`notifications ${open ? 'open' : 'close'}`)
                localStorage.setItem(
                  'notificationCount',
                  data?.notifications?.pageInfo?.totalCount.toString()
                )
                setShowBadge(false)
              }}
            >
              <LightningBoltIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              {showBadge && <div className="w-2 h-2 bg-red-500 rounded-full" />}
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
            <Menu.Items className="overflow-y-auto absolute right-0 mt-1 min-w-full bg-white rounded-xl border shadow-sm dark:bg-gray-900 dark:border-gray-800 max-h-[80vh] sm:max-h-[60vh] sm:min-w-[28rem]">
              <List />
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  )
}

export default Notification
