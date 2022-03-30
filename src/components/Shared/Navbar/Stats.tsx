import { gql, useQuery } from '@apollo/client'
import { GlobalProtocolStats } from '@generated/types'
import { Menu } from '@headlessui/react'
import {
  ChatAlt2Icon,
  CollectionIcon,
  DuplicateIcon,
  FireIcon,
  PencilAltIcon,
  UserAddIcon,
  UsersIcon
} from '@heroicons/react/outline'
import { humanize } from '@lib/humanize'
import { ERROR_MESSAGE } from 'src/constants'

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
  isLenster?: boolean
}

const MenuItem: React.FC<Props> = ({ icon, title, isLenster = false }) => (
  <Menu.Item
    as="div"
    className="px-4 py-1 m-2 text-sm text-gray-700 dark:text-gray-200"
  >
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1">
        {icon}
        {isLenster && (
          <img src="/logo.svg" className="w-3 h-3" alt="Lenster's Data" />
        )}
      </div>
      <div>{title}</div>
    </div>
  </Menu.Item>
)

const Stats: React.FC = () => {
  const { data, loading, error } = useQuery(LENSTER_STATS_QUERY, {
    variables: {
      request: {
        sources: ['Lenster', 'Lenster Community', 'Lenster Crowdfund']
      }
    },
    pollInterval: 1000
  })

  if (loading) return <div className="h-4 m-3 rounded-lg shimmer" />
  if (error)
    return <div className="m-3 font-bold text-red-500">{ERROR_MESSAGE}</div>

  const stats: GlobalProtocolStats = data?.globalProtocolStats

  return (
    <>
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
        isLenster
      />
      <MenuItem
        icon={<DuplicateIcon className="w-4 h-4" />}
        title={
          <span>
            <b>{humanize(stats?.totalMirrors)}</b> total mirrors
          </span>
        }
        isLenster
      />
      <MenuItem
        icon={<ChatAlt2Icon className="w-4 h-4" />}
        title={
          <span>
            <b>{humanize(stats?.totalComments)}</b> total comments
          </span>
        }
        isLenster
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
    </>
  )
}

export default Stats
