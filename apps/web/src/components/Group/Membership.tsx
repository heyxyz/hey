import type { Group } from '@hey/types/hey';
import type { FC } from 'react';

import Join from '@components/Shared/Group/Join';
import Leave from '@components/Shared/Group/Leave';
import humanize from '@hey/lib/humanize';
import plur from 'plur';
import { useEffect, useState } from 'react';

interface MembershipProps {
  group: Group;
}

const Membership: FC<MembershipProps> = ({ group }) => {
  const [count, setCount] = useState(0);
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    setCount(group.members);
    setHasJoined(group.isMember);
  }, [group]);

  return (
    <div className="space-y-5">
      <div className="text-left">
        <div className="text-xl">{humanize(count)}</div>
        <div className="ld-text-gray-500">{plur('Member', count)}</div>
      </div>
      {hasJoined ? (
        <Leave
          group={group}
          onLeave={() => {
            setCount(count - 1);
            setHasJoined(false);
          }}
        />
      ) : (
        <Join
          group={group}
          onJoin={() => {
            setCount(count + 1);
            setHasJoined(true);
          }}
        />
      )}
    </div>
  );
};

export default Membership;
