import type { FC } from 'react';

import formatDate from '@hey/lib/datetime/formatDate';

import type { StatsType } from './LeafwatchStats';

interface ActiveUsersProps {
  activeUsers: StatsType['dau'];
}

const ActiveUsers: FC<ActiveUsersProps> = ({ activeUsers }) => {
  return (
    <>
      <div className="divider" />
      <div className="p-5 text-lg font-bold">Daily Active Users</div>
      <div className="divider" />
      <div className="p-5">
        <table className="w-full border-x border-t">
          <thead>
            <tr className="border-b">
              <th className="border-r px-2 text-left">Date</th>
              <th className="border-r px-2 text-right">Active users</th>
              <th className="border-r px-2 text-right">Total events</th>
              <th className="px-2 text-right">Total impressions</th>
            </tr>
          </thead>
          <tbody>
            {activeUsers.map((activeUser, index) => (
              <tr className="border-b" key={index}>
                <td className="border-r px-2">{formatDate(activeUser.date)}</td>
                <td className="border-r px-2 text-right">{activeUser.dau}</td>
                <td className="border-r px-2 text-right">
                  {activeUser.events}
                </td>
                <td className="px-2 text-right">{activeUser.impressions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ActiveUsers;
