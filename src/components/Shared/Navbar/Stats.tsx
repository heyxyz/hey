import { gql, useQuery } from '@apollo/client';
import { Erc20Amount, GlobalProtocolStats } from '@generated/types';
import { Disclosure, Menu } from '@headlessui/react';
import {
  CashIcon,
  ChatAlt2Icon,
  CollectionIcon,
  FireIcon,
  PencilAltIcon,
  SwitchHorizontalIcon,
  UserAddIcon,
  UsersIcon
} from '@heroicons/react/outline';
import getTokenImage from '@lib/getTokenImage';
import humanize from '@lib/humanize';
import { FC, ReactNode } from 'react';
import { APP_NAME, ERROR_MESSAGE } from 'src/constants';

const LENSTER_STATS_QUERY = gql`
  query LensterStats {
    globalProtocolStats(request: { sources: ${APP_NAME} }) {
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
    communityStats: globalProtocolStats(
      request: { sources: "${APP_NAME} Community" }
    ) {
      totalPosts
    }
    crowdfundStats: globalProtocolStats(
      request: { sources: "${APP_NAME} Crowdfund" }
    ) {
      totalPosts
    }
  }
`;

interface Props {
  icon: ReactNode;
  title: ReactNode;
  isLenster?: boolean;
}

const MenuItem: FC<Props> = ({ icon, title, isLenster = false }) => (
  <Menu.Item as="div" className="py-1 px-4 m-2 text-sm text-gray-700 dark:text-gray-200">
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1">
        {icon}
        {isLenster && (
          <img src="/logo.svg" className="w-3 h-3" height={12} width={12} alt={`${APP_NAME}'s Data`} />
        )}
      </div>
      <div>{title}</div>
    </div>
  </Menu.Item>
);

const Stats: FC = () => {
  const { data, loading, error } = useQuery(LENSTER_STATS_QUERY, {
    pollInterval: 1000
  });

  if (loading) {
    return <div className="m-3 w-52 h-4 rounded-lg shimmer" />;
  }

  if (error) {
    return <div className="m-3 font-bold text-red-500">{ERROR_MESSAGE}</div>;
  }

  const stats: GlobalProtocolStats = data?.globalProtocolStats;
  const communityStats: GlobalProtocolStats = data?.communityStats;
  const crowdfundStats: GlobalProtocolStats = data?.crowdfundStats;

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
        icon={<SwitchHorizontalIcon className="w-4 h-4" />}
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
        icon={<UsersIcon className="w-4 h-4" />}
        title={
          <span>
            <b>{humanize(communityStats?.totalPosts)}</b> total communities
          </span>
        }
        isLenster
      />
      <MenuItem
        icon={<CashIcon className="w-4 h-4" />}
        title={
          <span>
            <b>{humanize(crowdfundStats?.totalPosts)}</b> total crowdfunds
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
      <div className="divider" />
      <Disclosure>
        <>
          <Disclosure.Button className="menu-item">
            <div className="flex items-center space-x-2">
              <CashIcon className="w-4 h-4" />
              <div>Total Revenue</div>
            </div>
          </Disclosure.Button>
          <Disclosure.Panel className="px-6 pb-3 space-y-2 text-sm text-gray-500">
            {stats?.totalRevenue.map((revenue: Erc20Amount) => (
              <div key={revenue?.asset?.address} className="flex items-center space-x-1">
                <img
                  className="w-5 h-5"
                  src={getTokenImage(revenue?.asset?.symbol)}
                  alt="revenue?.asset?.symbol"
                />
                <span>
                  <b>{revenue?.value}</b> {revenue?.asset?.symbol}
                </span>
              </div>
            ))}
          </Disclosure.Panel>
        </>
      </Disclosure>
    </>
  );
};

export default Stats;
