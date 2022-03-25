import { gql, useQuery } from '@apollo/client'
import { GlobalProtocolStats } from '@generated/types'
import { Menu, Transition } from '@headlessui/react'
import {
  ChartPieIcon,
  ChatAlt2Icon,
  CollectionIcon,
  DuplicateIcon,
  FireIcon,
  PencilAltIcon,
  UserAddIcon,
  UsersIcon
} from '@heroicons/react/outline'
import { humanize } from '@lib/humanize'
import { Fragment } from 'react'

const LENSTER_STATS_QUERY = gql`
  query LensterStats($request: GlobalProtocolStatsRequest) {
    globalProtocolStats(request: $request) {
      totalProfiles
      totalPosts
      totalBurntProfiles
      totalMirrors
      totalComments
      totalCollects
      totalFollows
      totalRevenue {
        asset {
          symbol
        }
        value
      }
    }
  }
`

interface Props {
  icon: React.ReactChild
  title: React.ReactChild
}

const MenuItem: React.FC<Props> = ({ icon, title }) => (
  <Menu.Item
    as="div"
    className="px-4 py-1 m-2 text-sm text-gray-700 dark:text-gray-200"
  >
    <div className="flex items-center space-x-2">
      {icon}
      <div>{title}</div>
    </div>
  </Menu.Item>
)

const Stats: React.FC = () => {
  const { data } = useQuery(LENSTER_STATS_QUERY, {
    variables: {
      request: {
        sources: ['Lenster', 'Lenster Community', 'Lenster Crowdfund']
      }
    },
    pollInterval: 5000
  })

  const stats: GlobalProtocolStats = data?.globalProtocolStats

  return (
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
              <MenuItem
                icon={<UsersIcon className="w-4 h-4" />}
                title={
                  <span>
                    <b>{humanize(stats?.totalProfiles)}</b> total profiles
                  </span>
                }
              />
              <MenuItem
                icon={<FireIcon className="w-4 h-4" />}
                title={
                  <span>
                    <b>{humanize(stats?.totalBurntProfiles)}</b> profiles burnt
                  </span>
                }
              />
              <MenuItem
                icon={<PencilAltIcon className="w-4 h-4" />}
                title={
                  <span>
                    <b>{humanize(stats?.totalPosts)}</b> total posts
                  </span>
                }
              />
              <MenuItem
                icon={<DuplicateIcon className="w-4 h-4" />}
                title={
                  <span>
                    <b>{humanize(stats?.totalMirrors)}</b> total mirrors
                  </span>
                }
              />
              <MenuItem
                icon={<ChatAlt2Icon className="w-4 h-4" />}
                title={
                  <span>
                    <b>{humanize(stats?.totalComments)}</b> total comments
                  </span>
                }
              />
              <MenuItem
                icon={<CollectionIcon className="w-4 h-4" />}
                title={
                  <span>
                    <b>{humanize(stats?.totalCollects)}</b> total collects
                  </span>
                }
              />
              <MenuItem
                icon={<UserAddIcon className="w-4 h-4" />}
                title={
                  <span>
                    <b>{humanize(stats?.totalFollows)}</b> total follows
                  </span>
                }
              />
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  )
}

export default Stats
